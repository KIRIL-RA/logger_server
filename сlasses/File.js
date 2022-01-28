require("express");
const {FileNotExistError} = require('./Exceptions/FileExceptions');

const readline = require('readline');
var fs = require("fs");

/**
 * Save, read and other actions on files.
 */
class File {
    /**
     * Getting list of directories in path
     * @param {string} path 
     * @returns list of directories
     */
    static GetDirectories(path) {
        return fs.readdirSync(path, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);
    }

    /**
     * Getting list of files in path
     * @param {string} path 
     * @returns list of exist files
     */
    static GetFiles(path) {
        return fs.readdirSync(path, { withFileTypes: true })
            .filter(dirent => !dirent.isDirectory())
            .map(dirent => dirent.name);
    }

    /**
     * Check is file exist
     * @param {string} path Path to save files.
     * @param {string} filename Name of file to check.
     * @param {bool} getPathFromFilename True if you need to get file path fron filename.
     * @returns True if fule exist, else false
     */
    static IsFileExist(path, filename, getPathFromFilename = false) {
        let newFileData = getPathFromFilename ? File.GetPathFromFileName(filename) : null;
        let newFileName = getPathFromFilename ? newFileData.fileName : filename;
        path = getPathFromFilename ? path + newFileData.filePath : path;

        return fs.existsSync(path + newFileName);
    }

    /**
     * Saves an array of files from a web request to a specified folder.
     * @param {string} path Path to save files.
     * @param {Express.Request.files} files Array of files to save.
     * @param {bool} getPathFromFilename True if you need to get file path fron filename.
     */
    static SaveFilesFromRequest(path, files, getPathFromFilename = false) {
        files.forEach(file => {
            let newFileData = getPathFromFilename ? File.GetPathFromFileName(file.originalname) : null;
            let newFileName = getPathFromFilename ? newFileData.fileName : file.originalname;
            path = getPathFromFilename ? path + newFileData.filePath : path;

            if (!fs.existsSync(path)) {
                // If path not esist, create it
                fs.mkdirSync(path, { recursive: true }, err => { throw err; });
            }

            // Save file in new directory
            fs.rename(file.path, path + newFileName,
                err => { if (err) throw err; })
        });
    }

    /**
     * Read file such as lines array
     * @param {string} path 
     * @param {function lineHandler(line) { }} Action with one function
     * @returns array of file lines
     */
    static async ReadFileAsLines(path, lineHandler) {
        let lines = [];

        if(!fs.existsSync(path)) throw new FileNotExistError("File not exist");

        const readInterface = readline.createInterface({
            input: fs.createReadStream(path),
            output: process.stdout,
            console: false
        });

        for await(let line of readInterface) {
            lines.push(line);
            lineHandler(line);
        }

        return lines;
    }

    /**
     * Split filename on file path and file name. IMPORTANT: filename need to be like 2021,11\,23.csv 
     * @param {string} fileName 
     * @returns Array, contains filpath and filename. Example: fileName = 2021,11,23.csv, returns { filePath: "2021/11/", fileName: "23.csv" } 
     */
    static GetPathFromFileName(fileName) {
        let arrayOfStrings = fileName.split(',');

        let filePath = arrayOfStrings[0] + '/' + arrayOfStrings[1] + '/';
        return { filePath: filePath, fileName: arrayOfStrings[2] };
    }
}

module.exports = File;