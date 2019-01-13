
// 广播器
export default {
    listenerTable: {},

    addListener(tag: string, listener: Function) {
        this.listenerTable[tag] = listener;;
    },

    notify(tag: string, para?: any) {
        return this.listenerTable[tag](para);
    }
}






