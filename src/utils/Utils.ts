export default class Utils {
    public static timestamp(): number {
        return Date.now();
    }

    public static scheme(task: Function, delay: number): number {
        return setTimeout(task, delay);
    }

    public static isPong(data: string | ArrayBuffer): boolean {
        // TODO adjust pong type
        if (data instanceof ArrayBuffer && data.byteLength === 1) {
            return true;
        } else {
            return false;
        }
    }
}