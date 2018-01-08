# Module Search

Module Search is a simple utility library to assist in locating a module. 

### Installation

Install simply by using:

`npm install module-search --save-dev` 

or

`yarn add module-search --dev`

### Usage

The following function is exported:

`moduleSearch(packageName, options)`

- The `packageName` argument should be used to define the package you want to locate.
- The `options` argument is optional. It can provide further specification about where to search. It should be an object and can contain the following properties:
    + `cwd` - defines the current working directory. The default value is the directory the process is running in.
    + `directories` - a string array defining all the followings that can contain modules. The default value is `['node_modules', 'web_modules']`.
