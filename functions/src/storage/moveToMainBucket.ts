import type {
  StorageObjectData,
} from "@google/events/cloud/storage/v1/StorageObjectData";

export const moveToMainBucket = (
  event: StorageObjectData
) => {
  console.debug(JSON.stringify(event));
};
