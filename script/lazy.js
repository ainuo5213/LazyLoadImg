function lazyLoad(defaultImg) {
    var imgs = document.querySelectorAll("[data-lazy]");
    imgs = Array.from(imgs);
    setDefault();

    loadImgs();

    //滚动条事件
    var timer;
    function onChange() {
        //防抖
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(function () {
            loadImgs();
        }, 500);
    }
    document.body.onscroll = function () {
        //防抖
        onChange();
    }

    window.onresize = function(){
        onChange();
    }

    /**
     * 设置默认图片
     */
    function setDefault() {
        if (!defaultImg) {
            return;
        }
        for (var i = 0; i < imgs.length; i++) {
            var img = imgs[i];
            img.src = defaultImg;
        }
    }

    /**
     * 加载图片
     */
    function loadImgs() {
        for (var i = 0; i < imgs.length; i++) {
            var img = imgs[i];
            if (loadOneImg(img)) {
                i--;
            }
        }
    }

    function loadOneImg(img) {

        //垂直方向上，图片是否在可见区域
        var imgTop = img.offsetTop; //图片垂直偏移量
        //滚动距离
        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        var offsetY = imgTop - scrollTop;//相对于视口的偏移量
        var height = parseInt(document.defaultView.getComputedStyle(img, null).height);
        if (isNaN(height)) {
            height = 0;
        }
        if (offsetY + height <= 0) {
            return false;
        }
        if (offsetY >= window.innerHeight) {
            return false;
        }
        var index = imgs.lastIndexOf(img);
        imgs.splice(index, 1);
        //加载图片
        img.src = img.dataset.src;
        img.onload = function(){
            if(img.dataset.original){
                setTimeout(() => {
                    img.src = img.dataset.original;
                    img.onload = null;
                }, 2000);
            }
        }

        return true;
    }
}