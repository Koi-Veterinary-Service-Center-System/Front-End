import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../configs/firebase";

const uploadFile = async (file: File): Promise<string> => {
  console.log(file);
  const storageRef = ref(storage, file.name);
  const response = await uploadBytes(storageRef, file);
  const dowloadURL = await getDownloadURL(response.ref);
  return dowloadURL;
};
export default uploadFile;
