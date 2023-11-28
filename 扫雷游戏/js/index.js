/**
 * 游戏主逻辑
 */

//用于存储生成的地雷数量
var mindArray = null;
//获取格子容器
var mineArea = $('.mineArea')

//用于存储每个格子的额外信息
var tableData = []
/**
 * 生成地雷的方法
 * @returns 返回地雷数组
 */


function initMine() {
    //生成数组
    var arr = new Array(curLever.row * curLever.col);
    //向这个数组里面填充值
    for (var i = 0; i < arr.length; i++)
        arr[i] = i;
    //打乱数组
    arr.sort(() => 0.5 - Math.random())
    // 截取数组只保留对应雷的数组长度

    return arr.slice(0, curLever.mineNum)
}



/**
 * 游戏初始化函数
 */
function init() {

    //1.随机生成所选配置对应数量的雷
    mineArray = initMine();

    //2.生成所选配置的表格

    var table = document.createElement('table')

    //初始格子下标
    var index = 0;

    for (var i = 0; i < curLever.row; i++) {
        //创建新的一行
        var tr = document.createElement("tr")
        tableData[i] = []
        for (var j = 0; j < curLever.col; j++) {
            var td = document.createElement("td")
            var div = document.createElement("div")


            //每一个小格子都会对应一个js对象
            //该对象存储额外信息
            tableData[i][j] = {
                row: i,            //格子的行
                col: j,            //格子的列
                type: "number",    //格子的属性 数字就是number 雷mine
                value: 0,          //周围雷的数量
                index,            //格子的下标
                checked: false,    //是否被检验过
            }

            //为每一个div添加一个下标，方便用户点击时候获取对应格子的信息
            div.dataset.id = index;
            //标记当前的div是否可以插旗
            div.classList.add("canFlag");

            if (mineArray.includes(tableData[i][j].index)) {
                tableData[i][j].type = "mine";
                div.classList.add("mine")
            }
            td.appendChild(div)
            tr.appendChild(td);

            //下标自增
            index++;
        }

        table.appendChild(tr)
    }
    mineArea.appendChild(table)
}

/**
 * 显示答案
 */
function showAnswer() {
    //核心逻辑
    //把所有的雷显示出来
    //有些雷可能是插了旗的，判断插旗是否正确
    //正确添加上绿色背景，错误添加红色背景
    //获取所有的dom元素
    var mineArr = $$("td>div.mine")
    for (var i = 0; i < mineArr.length; i++)
        mineArr[i].style.opacity = 1;
}

/** 
 * 找到对应dom在tabledata 里面的js对象
 * @param {*} cell
*/
function geTtableItem(cell) {
    var index = cell.dataset.id
    var flatTableData = tableData.flat();
    var i = flatTableData.filter(item => item.index == index)

    return i
}
/**
 * 返回该对象对应的四周的边界
 */
function getBound(obj) {
    // //确定边界
    // //上下
    var rowTop = obj.row - 1 < 0 ? 0 : obj.row - 1;
    var rowBottom = obj.row + 1 === curLever.row ? curLever.row - 1 : obj.row + 1;
    // //左右
    var colLeft = obj.col - 1 < 0 ? 0 : obj.col - 1;
    var colRight = obj.col + 1 === curLever.col ? curLever.col - 1 : obj.col + 1
    return {
        rowTop,
        rowBottom,
        colLeft,
        colRight,
    };

}

/**
 * 返回周围一圈雷的数量
 */
function findMineNum(obj) {

    var count = 0;

    var { rowTop, rowBottom, colLeft, colRight, } = getBound(obj[0]);
    for (var i = rowTop; i <= rowBottom; i++) {
        for (var j = colLeft; j <= colRight; j++) {
            if (tableData[i][j].type === "mine") {
                count++
            }
        }
    }

    return count;

}


/**
 * 
 * @param {*} obj 
 */
function getDOM(obj) {
    var divArray = $$("td>div")

    return divArray[obj.index]
}




/**
 * 搜索当前单元格的九宫格区域
 * @param {*} cell 用户点击的单元格
 */
function getAround(cell) {
    cell.parentNode.style.border = "none";
    cell.classList.remove("canFlag")

    //1.获取到该dom元素在tableDATA里对应的对象
    var tableItem = geTtableItem(cell)

    if (!tableItem) {
         return;
     }

    tableItem.checked = true;

    //接下来，得到了dom对象所对应的
    // 那我们开始查看周围一圈是否有雷
    var mineNum = findMineNum(tableItem)

    if (!mineNum) {
        //没有雷
        // 继续搜索
        var { rowTop, rowBottom, colLeft, colRight } = getBound(tableItem[0]);
        for (var i = rowTop; i <= rowBottom; i++) {
            for (var j = colLeft; j <= colRight; j++) {
                if(!(tableData[i][j].checked)){
                    getAround(getDOM(tableData[i][j]));
                }
                    
            }
        }

    } else {
        //周围有雷，显示数量

        cell.innerText = mineNum;


    }


}


/**
 * 区域搜索
 * @param {*} cell 用户点击的Dom元素
 */
function searchAera(cell) {
    //核心思路：
    // 整体分为三种情况
    //1.当单元格是雷

    if (cell.classList.contains("mine")) {

        //进入这个If，说明踩雷了
        cell.classList.add("error");
        showAnswer();
        return
    }
    //2.当前单元格不是雷，判断周围一圈有没有雷
    //如果有雷显示数量
    //如果没有雷继续递归搜索
    getAround(cell)
}


/**
 * 
 * @param {*} cell 用户点击的Dom元素
 */
function flag(cell) { }
/**
 * 绑定事件
 */
function bindEvent() {
    // 鼠标点击事件
    mineArea.onmousedown = function (e) {
        if (e.button === 0) {
            //用户点击的是鼠标左键，进行区域搜索

            searchAera(e.target);
        }
        if (e.buttou === 2) {
            //说明用户点击的是右键，进行插旗操作
            flag(e.target)
        }
    }

    //阻止鼠标左键行为
    mineArea.oncontextmenu = function () {
        return false;
    }
}


// 程序入口
function main() {
    //1.游戏初始化
    init()

    //2.绑定事件
    bindEvent()
}


main()