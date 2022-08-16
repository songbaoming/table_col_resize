/**
 * 
 */
var styleNode;
var curNode;
var index = 0;
var oldX;
var curTable;

function getElementLeft(element) {
    var actualLeft = element.offsetLeft;
    var current = element.offsetParent;

    while (current !== null) {
        actualLeft += current.offsetLeft;
        current = current.offsetParent;
    }

    return actualLeft;
}

function getElementTop(element) {
    var actualTop = element.offsetTop;
    var current = element.offsetParent;

    while (current !== null) {
        actualTop += current.offsetTop;
        current = current.offsetParent;
    }

    return actualTop;
}
window.onresize = function () {
    var rgrips = curTable.previousElementSibling.children;
    var cells = curTable.rows[0].cells;
    var top = getElementTop(curTable);
    for (i = 0; i < cells.length - 1; i++) {
        var rgrip = rgrips[i];
        var left = getElementLeft(cells[i]);
        rgrip.style.left = left + cells[i].offsetWidth - 4 + "px";
        rgrip.style.top = top + "px";
        rgrip.style.height = curTable.offsetHeight + "px";
    }
}

function mmovefunc(e) {
    var cells = curTable.rows[0].cells;
    var cell = cells[index];
    var rgrip = curTable.previousElementSibling.children[index];
    if (e.x < oldX && e.x < rgrip.offsetLeft + 4 && cell.clientWidth > 18) {
        var offset = Math.min(oldX - e.x, Math.max(0, cell.clientWidth - 18));
        cell.style.width = (parseInt(cell.style.width) - offset) + "px";
        cell.nextElementSibling.style.width = (parseInt(cell.nextElementSibling.style.width) + offset) + "px";
        rgrip.style.left = rgrip.offsetLeft - offset + "px";
        var rgrips = curTable.previousElementSibling.children;
        for (i = 0; i < cells.length - 1; i++) {
            var rgrip = rgrips[i];
            var left = getElementLeft(cells[i]);
            rgrip.style.left = left + cells[i].offsetWidth - 4 + "px";
            rgrip.style.top = top + "px";
            rgrip.style.height = curTable.offsetHeight + "px";
        }
    } else if (e.x > oldX && e.x > rgrip.offsetLeft + 4 && cell.nextElementSibling.clientWidth > 18) {
        var offset = Math.min(e.x - oldX, Math.max(0, cell.nextElementSibling.clientWidth - 18));
        cell.style.width = (parseInt(cell.clientWidth) + offset) + "px";
        cell.nextElementSibling.style.width = (parseInt(cell.nextElementSibling.style.width) - offset) + "px";
        rgrip.style.left = (rgrip.offsetLeft + offset) + "px";
        var rgrips = curTable.previousElementSibling.children;
        for (i = 0; i < cells.length - 1; i++) {
            var rgrip = rgrips[i];
            var left = getElementLeft(cells[i]);
            rgrip.style.left = left + cells[i].offsetWidth - 4 + "px";
            rgrip.style.top = top + "px";
            rgrip.style.height = curTable.offsetHeight + "px";
        }
    }
    oldX = e.x;
}

function mdownfunc(e) {
    document.getElementsByTagName("head")[0].appendChild(styleNode);
    document.addEventListener("mousemove", mmovefunc);
    index = 0;
    oldX = e.x;
    curNode = e.target;
    curTable = curNode.parentElement.nextElementSibling;
    var node = e.target;
    while ((node = node.previousElementSibling) != null)
        ++index;
}

window.onload = function () {
    styleNode = document.createElement("style");
    styleNode.innerHTML = "#rgrip { position: absolute; width: 10px; cursor: e-resize; }";
    document.getElementsByTagName("head")[0].appendChild(styleNode);

    styleNode = document.createElement("style");
    styleNode.innerHTML = "*{cursor: e-resize!important;user-select:none;}";

    var tables = document.getElementsByTagName("table");
    for (i = 0; i < tables.length; ++i) {
        var rgrips = document.createElement("div");
        var table = tables[i];
        table.parentElement.insertBefore(rgrips, table);
        var cells = table.rows[0].cells;
        var top = getElementTop(table);
        for (j = 0; j < cells.length; j++) {
            cells[j].style.width = cells[j].clientWidth + "px";
        }
        for (j = 0; j < cells.length - 1; j++) {
            var rgrip = document.createElement("div");
            rgrip.id = "rgrip";
            rgrip.onmousedown = mdownfunc;
            var left = getElementLeft(cells[j]);
            rgrip.style.left = left + cells[j].offsetWidth - 4 + "px";
            rgrip.style.top = top + "px";
            rgrip.style.height = table.offsetHeight + "px";
            rgrips.appendChild(rgrip);
        }
    }
}

function mup() {
    document.removeEventListener("mousemove", mmovefunc);
    var head = document.getElementsByTagName("head")[0];
    if (head.lastElementChild == styleNode)
        head.removeChild(styleNode);
}
document.addEventListener("mouseup", mup, true);