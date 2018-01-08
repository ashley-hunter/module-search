import { join, resolve } from 'path';
import { existsSync } from 'fs';

const default_options: IOptions = {
    cwd: process.cwd(),
    directories: ['node_modules', 'web_modules']
};

export function moduleSearch(package_name: string, options?: IOptions): string | null {

    // use default options where the user has not specified any
    options = Object.assign({}, default_options, options);

    // create absolute paths for all target folders
    const paths = options!.directories!.map(directory => join(options!.cwd!, directory, package_name));

    // ensure the folder exists
    const found = paths.find(path => existsSync(path));

    // If a match was found then return it
    if (found) {
        return found;
    }

    // otherwise check for a node_modules folder in parent directory
    const parent_directory = resolve(options!.cwd!, '..');

    // if we are at the top most folder return null
    if (parent_directory === options!.cwd) {
        return null;
    }

    // update the cwd to be the parent directory
    options!.cwd = parent_directory;

    // otherwise call this function in parent folder
    return moduleSearch(package_name, options);
}

export interface IOptions {
    cwd?: string;
    directories?: string[]
}