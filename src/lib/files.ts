import { statSync, createWriteStream } from "fs";
import { copyFile, mkdir, readdir } from "fs/promises";
import { tmpdir } from "os";
import path, { dirname } from "path";
import { URL } from "url";

const TMP_DIR = path.resolve(`${tmpdir()}/polycephal_build_cache`);

export const isFile = (file: string) => {
  let fileStat;
  try {
    fileStat = statSync(file);
  } catch (error) {
    return false;
  }
  if (fileStat.isDirectory()) {
    return false;
  }
  return fileStat;
};

export const isDirectory = (dir: string) => {
  let dirStat;
  try {
    dirStat = statSync(dir);
  } catch (error) {
    return false;
  }
  if (dirStat.isDirectory()) {
    return true;
  } else {
    // we shouldn't be trying to create directories that match existing file names
    throw new Error(`${dir} exists but isn't a directory`);
  }
};

export const touchDirectory = async (dir: string) => {
  if (!isDirectory(dir)) {
    await mkdir(dir, {
      recursive: true,
    });
  }
};

/**
 * Uploads data to a given URL.
 *
 * @param {string} url - The URL where the data should be uploaded.
 * @param {string | Buffer} data - The data to upload. Can be a string or a Buffer.
 * @returns {Promise<void>} A promise that resolves when the upload is complete.
 */
export const upload = async (url, data) => {
  try {
    const response = await fetch(url, {
      method: "PUT",
      body: data,
      headers: { "Content-Type": "application/octet-stream" },
    });

    if (!response.ok) {
      throw new Error(`unexpected response ${response.statusText}`);
    }
    return response;
  } catch (error) {
    console.error(`Error uploading data to ${url}\nError: ${error.message}`);
  }
};

/**
 * Downloads a file from a given URL. If a path is provided, writes the file to that path.
 * If no path is provided, returns a buffer of the file content.
 *
 * @param {string} url - The URL of the file to download.
 * @param {string} [path] - The path where the file should be written. If undefined, the function will return a buffer.
 * @returns {Promise<Buffer | void>} A promise that resolves to a buffer of the file content if no path is provided, or void if a path is provided.
 */

export async function download(url, filepath) {
  try {
    const response = await fetch(url);

    if (!response.ok || !response.body) {
      throw new Error(`Unexpected response ${response.statusText}`);
    }
    const reader = response.body.getReader();
    const fileStream = createWriteStream(filepath);
    let done = false;
    while (!done) {
      const { value, done: chunkDone } = await reader.read();
      done = chunkDone;
      if (value) {
        fileStream.write(Buffer.from(value));
      }
    }
    fileStream.close();
  } catch (error) {
    console.error("Error downloading image:", error);
  }
}

export const downloadFileWithCache = async (url, path) => {
  const parsedUrl = new URL(url);
  const downloadPath = `${TMP_DIR}/downloads/${parsedUrl.hostname}/${parsedUrl.pathname}`;
  if (!isFile(downloadPath)) {
    await download(url, downloadPath);
  }
  mkdir(dirname(path), { recursive: true });

  try {
    await copyFile(downloadPath, path);
  } catch (error) {
    console.log(`The file could not be copied from ${downloadPath} to ${path}`);
    console.log(`Error: ${error.message}`);
  }
};

export const listFiles = async (
  path,
  options = {
    match: /.*/,
  }
) => {
  let files = await readdir(path);
  if (options.match) {
    files = files.reduce((found, item) => {
      if (item.match(options.match)) {
        found.push(item);
      }
      return found;
    }, []);
  }
  return files;
};
