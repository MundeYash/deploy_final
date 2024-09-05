import { getDb } from "./db";

export async function saveBatchCode(batchCodeData) {
  const db = getDb();
  const batchCode = db.collection("batchCode");
  await batchCode.insertOne({
    batchCode: batchCodeData.batchCode,
    batchDescription: batchCodeData.batchDescription,
    departmentAddress: batchCodeData.departmentAddress,
    trainingMode: batchCodeData.trainingMode,
    venueOfTraining: batchCodeData.venueOfTraining,
    courseName: batchCodeData.courseName,
    technologyName: batchCodeData.technologyName,
    revenueOfBatch: batchCodeData.revenueOfBatch,
    courseDuration: {
      value: batchCodeData.courseDurationValue,
      format: batchCodeData.courseDurationFormat,
    },
    startDate: batchCodeData.startDate,
    endDate: batchCodeData.endDate,
    participantsNo: batchCodeData.participantsNo,
    remarks: batchCodeData.remarks,
  });
}

export default saveBatchCode;
