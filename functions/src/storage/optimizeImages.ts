import type {StorageObjectData} from "@google/events/cloud/storage/v1/StorageObjectData";
import {storage} from "../helpers/gCloudClients";
import * as sharp from "sharp";

const options = {
  destBucket: "derlev.xyz",
};

export const optimizeImages = async (event: StorageObjectData) => {
  if (!event.bucket || !event.name || !event.contentType?.startsWith("image/"))
    return;

  const file = storage.bucket(event.bucket).file(event.name);

  const fileRead = file.createReadStream();

  const sharpRezise = sharp()
    .webp({force: false, quality: 80, effort: 6})
    .png({force: false, compressionLevel: 7, effort: 7})
    .jpeg({force: false, quality: 80, mozjpeg: true})
    .gif({force: false})
    .tiff({force: false, quality: 80});

  const sharpStream = fileRead.pipe(sharpRezise);

  const destFile = storage
    .bucket(options.destBucket)
    .file(event.name)
    .createWriteStream();

  const writeDestStream = sharpStream.pipe(destFile);

  writeDestStream.on("close", async () => {
    await file.delete();
  });
};
