const MongoClient = require("mongodb").MongoClient;
const moment = require("moment-timezone");
const _ = require("underscore");

const uri =
  "mongodb://development-mongodb-replicaset-0.development-mongodb-replicaset.development-mongodb-replicaset.svc.cluster.local:27017,development-mongodb-replicaset-1.development-mongodb-replicaset.development-mongodb-replicaset.svc.cluster.local:27017,development-mongodb-replicaset-2.development-mongodb-replicaset.development-mongodb-replicaset.svc.cluster.local:27017?replicaSet=rs0&readPreference=primaryPreferred";
const clientConnection = new MongoClient(uri);

const selectedTestFacilities = [
  "Q45D7XYPeWuWm63z8",
  "aQPsDDyFW2dKtinQc",
  "TcMfemFgs3EHjZjYs"
];
const zeroDate = new Date(-62135596800000);
const availableStatusColors = {
  Unassigned: "#000000", // black
  Ready: "#1f78b4", // blue
  Arming: "#1f78b4", // blue
  Armed: "#33a02c", // green
  PreAlert: "#33a02c", // green
  Alert: "#e31a1c", // red
  AlertFailSafe: "#e31a1c", // red
  Hold: "#984ea3", // purple
  Disconnect: "#000000", // black
  Unknown: "#cfcfcf" // grey
};
const areaStatusMap = {
  [-1]: "Unassigned",
  [0]: "Ready",
  [1]: "Arming",
  [2]: "Armed",
  [3]: "PreAlert",
  [4]: "Alert",
  [5]: "AlertFailSafe",
  [6]: "Hold",
  [7]: "Disconnect"
};
const matchedSeries = {
  _id: "D9P4MZEghOsI79koo",
  facility_id: "TcMfemFgs3EHjZjYs",
  segment_id: "A6qiLQbik0MWg4Sds"
};
const getFacilityAreas = tree =>
  tree.reduce(
    (acc, area) => getFacilityAreas(area.children).concat(acc),
    tree.map(a => a._id)
  );

clientConnection.connect(async function(err, client) {
  const db = client.db("suredb");
  const find = (collection, query) =>
    db
      .collection(collection)
      .find(query)
      .toArray();

  try {
    const timezone = "America/San_Francisco";
    const numDays = 1;

    //
    const rangeEnd = moment().tz(timezone);
    const rangeStart = rangeEnd
      .clone()
      .subtract(numDays, "days")
      .startOf("day");

    const segments = await find("time_segment", {
      series_id: matchedSeries._id,
      start_time: { $lte: rangeEnd.toDate() },
      $or: [
        { end_time: { $gte: rangeStart.toDate() } },
        { _id: matchedSeries.segment_id }
      ]
    });

    const formatForGoogleChart = (begin, end, value) => {
      const status = areaStatusMap[value] || "Unknown";
      return [
        begin.format("YYYY-MM-DD"),
        status,
        availableStatusColors[status],
        begin.toArray(),
        end.toArray()
      ];
    };

    const splitDayOverlapAndFormat = (begin, end, value) => {
      if (begin.date() === end.date()) {
        return [formatForGoogleChart(begin, end, value)];
      }
      return [
        formatForGoogleChart(moment(begin), moment(begin).endOf("day"), value),
        ...splitDayOverlapAndFormat(
          moment(begin)
            .add(1, "day")
            .startOf("day"),
          moment(end),
          value
        )
      ];
    };

    const chart = segments.reduce((acc, { values }) => {
      return acc.concat(
        values.reduce((acc, { end_timestamp, start_timestamp, value }) => {
          const startTimestamp = moment(start_timestamp).tz(timezone);
          const endTimestamp = moment(end_timestamp).tz(timezone);
          const isCurrentlyRunning = endTimestamp.isSame(zeroDate);

          const isInRange =
            !startTimestamp.isSame(zeroDate) &&
            startTimestamp.isBefore(rangeEnd) &&
            (endTimestamp.isAfter(rangeStart) || isCurrentlyRunning);

          if (isInRange) {
            const begin = moment.max(startTimestamp, rangeStart);
            const end = isCurrentlyRunning
              ? rangeEnd
              : moment.min(endTimestamp, rangeEnd);

            return acc.concat(splitDayOverlapAndFormat(begin, end, value));
          }
          return acc;
        }, [])
      );
    }, []); 

    chart.map(event => [...event.slice(0,3), new Date(...event[3]), new Date(...event[4])]) /* ?+*/ ;
  } catch (e) {
    console.log("**** e ****", e);
  }

  await client.close();
});
