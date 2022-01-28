
/**
 * Server event logger.
 */
class Logger{

    constructor(enableDebugLog = false){
        this.enableDebugLog = enableDebugLog;
    }

    /**
     * Log ordinary event.
     * @param {string} event Event to log. 
     */
    Log(event) {
        event = "[EVENT] " + event;
        if(this.enableDebugLog) console.log(event);
    }

    /**
     * Log succes event.
     * @param {string} event Event to log. 
     */
    LogSucces(event){
        event = "[OK] " + event;
        if(this.enableDebugLog) console.log(event);
    }

    /**
     * Log error event.
     * @param {string} event Event to log. 
     */
    LogError(event){
        if(this.enableDebugLog) console.error(event);
    }
}

module.exports = Logger;