function allSize() {
    let deviceWidth = document.documentElement.clientWidth;
    if (deviceWidth > 640) deviceWidth = 640;
    window.REM = deviceWidth / 3.75
    document.documentElement.style.fontSize = REM + 'px';
}

allSize();
window.onresize = function () {
    allSize();
};

