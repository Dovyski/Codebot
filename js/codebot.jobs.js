/*
	The MIT License (MIT)

	Copyright (c) 2015 Fernando Bevilacqua

	Permission is hereby granted, free of charge, to any person obtaining a copy of
	this software and associated documentation files (the "Software"), to deal in
	the Software without restriction, including without limitation the rights to
	use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
	the Software, and to permit persons to whom the Software is furnished to do so,
	subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
	FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
	COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
	IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
	CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/**
 * A jobs/scheduler system. It is able to run chunks of code at fixed intervals,
 * which is useful to implement pooling, animations, etc.
 */
var CodebotJobs = function() {
    var mIds = 1;
    var mJobs = {};
    var mSetIntervalId = null;
    var mSelf = this;

    var currentTime = function() {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now
        return !Date.now ? (new Date().getTime()) : Date.now();
    }

    var functionRunner = function() {
        var aId,
            aCurrentTime = currentTime(),
            aRemove = false,
            aJob;

        for(aId in mJobs) {
            aJob = mJobs[aId];

            if(aJob && aCurrentTime >= aJob.nextRunTime) {
                aRemove = aJob.callback(aJob.payload);
                aJob.nextRunTime = aCurrentTime + aJob.interval;

                if(aRemove || (aCurrentTime - aJob.startTime) >= aJob.duration) {
                    mJobs[aId] = null;
                }
            }
        }
    };

    /**
     * Schedules a new job to run at fixed intervals;
     *
     * @param  {Function} theFunction The function that will be invoked at fixed intervals. It should be <code>func(obj)</code>, where <code>obj</code> is an <code>Object</code> (the payload). If the function returns <code>true</code>, it will be automatically removed from the list of jobs, no matter the scheduled duration.
     * @param  {Number} theInterval The amount of time in milliseconds the scheduler should wait between every call to the specified function. The default is <code>500</code> milliseconds.
     * @param  {Object} thePayload  An object that will be passed as a parameter <code>theFunction</code>. This parameter will never be destroyed, so it can be used to create some sort of function context.
     * @param  {Number} theDuration For how long the scheduler will continue to call the specified function. The default value is <code>Number.MAX_VALUE</code>.
     * @return {int}             The id of the newly created job. It can be used to remove the job.
     */
    this.add = function(theFunction, theInterval, thePayload, theDuration) {
        var aCurrentTime = currentTime(),
            aId = mIds++;

        mJobs[aId] = {
            callback: theFunction,
            startTime: aCurrentTime,
            interval: theInterval || 500,
            duration: theDuration || Number.MAX_VALUE,
            nextRunTime: 0,
            payload: thePayload
        };

        return aId;
    };

    /**
     * Removes a job from the list.
     *
     * @param  {Function} theFunction The function that is invoked for the job being removed.
     * @return {Boolean}             Returns <code>true</code> if the job existed and was removed, or <code>false</code> otherwise.
     */
    this.remove = function(theFunction) {

    };

    /**
     * Removes a job from the list using its id as a search criteria. This method is is much
     * faster than <code>remove()</code>;
     *
     * @param  {Function} theFunction The function that is invoked for the job being removed.
     * @return {Boolean}             Returns <code>true</code> if the job existed and was removed, or <code>false</code> otherwise.
     */
    this.removeById = function() {

    };

    /**
     * Initializes the how thing up.
     */
    this.init = function() {
        // TODO: reduce pooling time.
        mSetIntervalId = setInterval(functionRunner, 500);
    };
};
