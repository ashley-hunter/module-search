import { join, resolve } from 'path';
import { existsSync, readFileSync } from 'fs';

const default_options: IOptions = {
    cwd: process.cwd(),
    directories: ['node_modules', 'web_modules']
};

/**
 * 
 * @param package_name The name of the package to locate
 * @param options Customise the search options
 */
export function getModulePath(package_name: string, options?: IOptions): string | null {

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
    return getModulePath(package_name, options);
}

export function getPackageJson(package_name: string, options?: IOptions): any | null {

    const module_directory = getModulePath(package_name, options);

    // if no match is found then return null
    if (!module_directory) {
        return null;
    }

    // if found then read the package.json file
    const package_path = resolve(module_directory!, 'package.json');

    // ensure the package.json file exists (although it would be odd if it didn't)
    if (!existsSync(package_path)) {
        return null;
    }

    // read the package.json file
    return require(package_path);
}

export function getPackageMain(package_name: string, options?: IOptions): string | null {
    
    const module_directory = getModulePath(package_name, options);
    const pkg = getPackageJson(package_name, options);

    // if module was not found or has no main field then stop here
    if (!module_directory || !pkg || !pkg.main) {
        return null;
    }

    // otherwise locate the main file
    return join(module_directory, pkg.main);
}

export interface IOptions {
    cwd?: string;
    directories?: string[]
}