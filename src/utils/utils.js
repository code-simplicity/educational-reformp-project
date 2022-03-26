export default {
    // 日期格式化
    dateFormat(str, type) {
        let date = new Date(str)
        let year = date.getFullYear()
        let month = this.formatZero(date.getMonth() + 1, 2)
        let day = this.formatZero(date.getDate(), 2)
        let hour = this.formatZero(date.getHours(), 2)
        let minute = this.formatZero(date.getMinutes(), 2)
        let seconds = this.formatZero(date.getSeconds(), 2)
        if (type === "YYYY-MM_DD") {
            return `${year}年${month}月${day}日`
        } else if (type === "YYYY-MM-DD HH-MM-SS") {
            return `${year}年${month}月${day}日 ${hour}:${minute}:${seconds}`
        } else if (type === "MM/DD HH-MM-SS") {
            return `${month}/${day}日 ${hour}:${minute}:${seconds}`
        }
    },

    // 补0的方法
    formatZero(num, len) {
        if (String(num).length > len) return num
        return (Array(len).join(0) + num).slice(-len)
    },

    // 获取tokenKey
    getCookieTokenKey(name) {
        // 首先就是将cookie中的后端返回的tokenKey拿出来
        const array = document.cookie.split(";")
        const obj = {}
        array.forEach((item) => {
            let arr = item.trim().split("=")
            obj[arr[0]] = arr[1]
        })
        for (const key in obj) {
            if (key === name) {
                return key
            }
        }
        return null
    },

    // 清除所有的cookie
    clearAllCookie() {
        let keys = document.cookie.match(/[^ =;]+(?==)/g);
        if (keys) {
            for (let i = keys.length; i--;) {
                document.cookie =
                    keys[i] +
                    "=0;expires=" +
                    new Date(0).toUTCString() +
                    ";max-age=0";
            }
        }
    }
}