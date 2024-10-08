import React, { useEffect, useState } from "react";
import {
  ScheduleComponent,
  ViewsDirective,
  ViewDirective,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
  Inject,
  Resize,
  DragAndDrop,
} from "@syncfusion/ej2-react-schedule";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import axios from "axios";

const PropertyPane = (props) => <div className="mt-5">{props.children}</div>;

const Scheduler = () => {
  const [scheduleObj, setScheduleObj] = useState(null);
  const [scheduleData, setScheduleData] = useState([]);

  // Fetch data from API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5155/api/vetslot/vetslot-list",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Log the API response to check structure
        console.log("API Response:", response.data);

        // Access the correct structure (adjust as necessary)
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.data;

        const transformedData = data.map((item) => ({
          Id: item.slotID,
          Subject: `${item.vetFirstName} ${item.vetLastName}`,
          StartTime: new Date(`2024-01-10T${item.slotStartTime}`),
          EndTime: new Date(`2024-01-10T${item.slotEndTime}`),
          IsAllDay: false,
          RecurrenceRule: item.isBook ? "" : null,
        }));

        // Log transformed data to verify structure
        console.log("Transformed Schedule Data:", transformedData);

        setScheduleData(transformedData);
      } catch (error) {
        console.error("Error fetching schedule data:", error);
      }
    };

    fetchData();
  }, []);

  const change = (args) => {
    if (scheduleObj) {
      scheduleObj.selectedDate = args.value;
      scheduleObj.dataBind();
    }
  };

  const onDragStart = (arg) => {
    arg.navigation.enable = true;
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <h2 className="text-2xl font-bold">Calendar</h2>
      <ScheduleComponent
        height="650px"
        ref={(schedule) => setScheduleObj(schedule)}
        selectedDate={new Date(2024, 0, 10)} // Ensure this date matches one of the event dates
        eventSettings={{ dataSource: scheduleData }}
        dragStart={onDragStart}
      >
        <ViewsDirective>
          {["Day", "Week", "WorkWeek", "Month", "Agenda"].map((item) => (
            <ViewDirective key={item} option={item} />
          ))}
        </ViewsDirective>
        <Inject
          services={[Day, Week, WorkWeek, Month, Agenda, Resize, DragAndDrop]}
        />
      </ScheduleComponent>
      <PropertyPane>
        <table style={{ width: "100%", background: "white" }}>
          <tbody>
            <tr style={{ height: "50px" }}>
              <td style={{ width: "100%" }}>
                <DatePickerComponent
                  value={new Date(2024, 0, 10)}
                  showClearButton={false}
                  placeholder="Current Date"
                  floatLabelType="Always"
                  change={change}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </PropertyPane>
    </div>
  );
};

export default Scheduler;
