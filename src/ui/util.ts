export const html2dom = function(htmlStr: string): HTMLElement {
    return new DOMParser().parseFromString(htmlStr, "text/html").body
}