
// 广播器
export default {
    listenerTable: {},

    addListener(tag: string, listener: Function) {
        this.listenerTable[tag] = listener;;
    },

    notify(tag: string, ...para) {
        return this.listenerTable[tag].apply(null, para);
    }
};






