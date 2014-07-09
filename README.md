VueTS
=====

VueTS is an approach to making Typescript and Vue work seamlessly together with full type support and api definitions. The repository contains a series of example applications and definition files for use with Vue and TypeScript. This exploration is part of a larger project using Vue and Typescript at Harland Clarke.

###Notes:
The current build of Vue within VueTS is from [Vue-Dev](https://github.com/yyx990803/vue/tree/dev). This release adds a vue.$init(config) method to allow configuration after instance creation. Typescript limits use of 'this' within calls to super within subclasses. This allows one extend Vue Classes directly in Typescript with full member typing and compile-time errors.

The vue.$init method has the same API as the Vue constuctor but provides a means to pass reference to class members/methods. This aligns the configuration API of Vue with the runtime API and allows for far deeper compile time errors within a project.

Vue is dependent on ES5 Javascript and thus you must compile Typescript to output ES5 with the `-t 'ES5'` flag.

###How to Use:
 1. Install Node.js: http://nodejs.org/
 2. Install Typescript 1.0 `npm install -g typescript`
 3. Clone: `git clone https://github.com/diverted247/vuets.git; cd vuets`
 4. Build: `tsc -t 'ES5' build.ts`
 

###License:
MIT - Reuse and Remix as needed.

###Credits:
 * [Vue](http://vuejs.org/)
 * Evan You @youyuxi
 * Ryan Cavanaugh @SeaRyanC
 * Harland Clarke

Ted :)
