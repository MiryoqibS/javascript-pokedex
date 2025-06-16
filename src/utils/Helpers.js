export class Helper {
    capitalize(str) {
        const firstChar = str.slice(0, 1);
        const otherChars = str.slice(1);
        return firstChar.toUpperCase() + otherChars.toLowerCase();
    }

    createIcon(iconId, width, height) {
        const SPRITES_PATH = "/src/assets/sprites.svg";
        const SVG_NS = "http://www.w3.org/2000/svg";
        const XLINK = "http://www.w3.org/1999/xlink";

        const icon = document.createElementNS(SVG_NS, "svg");
        icon.setAttribute("width", width);
        icon.setAttribute("height", height);

        const use = document.createElementNS(SVG_NS, "use");
        use.setAttributeNS(XLINK, "xlink:href", `${SPRITES_PATH}#${iconId}`);

        icon.appendChild(use);

        return icon;
    }
}