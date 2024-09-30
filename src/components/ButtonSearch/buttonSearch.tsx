import { Input } from "antd";
import type { GetProps } from "antd";

function buttonSearch() {
  type SearchProps = GetProps<typeof Input.Search>;

  const { Search } = Input;

  const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
    console.log(info?.source, value);
  return (
    <div>
      <Search placeholder="input search text" onSearch={onSearch} enterButton />
    </div>
  );
}

export default buttonSearch;
