const Pic2Text = class {
    top = 0
    width = 1.0
    cells = []
    imgWidth = 0
    imgHeight = 0
    pixelUnit = 3
    vmHeadCount = 30 //内置虚拟头像数量
    cellSpace = 2//瓦片间隔像素
    scale = 20
    interval = 30//每张间隔时间
    picData = []//照片数据集
    finish = null

    marginTop = 0
    marginLeft = 0
    vw = 0 //区域实际像素宽度
    vh = 0 //区域实际像素宽度
    cellWidth = 0 //png中像素单元格宽度
    cellHeight = 0 //png中像素单元格高度
    picNum = 0//当前显示到了第几张
    isVmSetup = false
    vmSumCount = 0

    constructor({top, width, imgWidth, imgHeight, pixelUnit, cells, vmHeadCount, cellSpace, scale, interval, finish}){
      if(top != null) {
        this.top = top
        this.marginTop = top
      }

      if(width != null) {
        this.width = width
      }

      if(imgWidth != null) {
        this.imgWidth = imgWidth
      }

      if(imgHeight != null) {
        this.imgHeight = imgHeight
      }

      if(pixelUnit != null) {
        this.pixelUnit = pixelUnit
      }

      this.cells = cells

      if(vmHeadCount != null) {
        this.vmHeadCount = vmHeadCount
      }

      if(cellSpace != null) {
        this.cellSpace = cellSpace
      }

      if(scale != null) {
        this.scale = scale
      }
      
      if(interval != null) {
        this.interval = interval
      }

      this.finish = finish

      let sw = $(window).width()
      let sh = $(window).height()
      this.vw = sw*this.width
      let bigCellHCount = this.imgWidth/this.pixelUnit
      this.cellWidth = Math.ceil((this.vw - (bigCellHCount-1)*this.cellSpace)/this.imgWidth)
      this.vw = this.cellWidth*this.imgWidth + this.imgWidth/this.pixelUnit*this.cellSpace
      this.cellHeight = this.cellWidth
      this.vh = this.cellHeight*this.imgHeight + this.imgHeight/this.pixelUnit*this.cellSpace
      this.marginLeft = Math.ceil((sw - this.vw)/2)
    }

    appendPicData(pics, vmCount) {
      for(let i=0; i<pics.length; i++) {
        this.picData.push(pics[i])
      }
      this.execute(vmCount)
    }

    setPicData(pics) {
      this.picData = []
      for(let i=0; i<pics.length; i++) {
        this.picData.push(pics[i])
      }
    }

    showAll() {
      let vmCount = this.cells.length - this.picData.length
      this.execute(vmCount)
    }

    execute(vmCount) {
      for(let i=this.picNum; i<this.picData.length; i++) {
        //console.log(i)
        let row = this.picData[i]
        if(i>=this.cells.length) {
          continue;
        }
        let headUrl = row['headUrl'];
        console.log(row)
        if(headUrl == null || headUrl == '') {
          headUrl = 'icon/head/null_head.jpg'
        }
        let cellIdx = this.picNum + this.vmSumCount
        this.addPic(this.cells[cellIdx], i*this.interval, headUrl, (cellIdx==this.cells.length-1))
        this.picNum++
      }

      //if(!this.isVmSetup) {
      for(let i=0; i<vmCount; i++) {
        let cellIdx = this.picNum + i + this.vmSumCount
        this.addPic(this.cells[cellIdx], i*this.interval, "", (cellIdx==this.cells.length-1))
      }
      this.vmSumCount += vmCount
      //isVmSetup = true
      //}
    }

    getHeight() {
      return this.vh
    }

    addPic(cell, delay, headUrl, isLast) {
      var that = this
      let picWidth = this.cellWidth*this.pixelUnit
      let picHeight = this.cellHeight*this.pixelUnit
      let sw = $(window).width()
      let srcX = Math.floor(Math.random()*sw + 0);
      let srcY = Math.floor(Math.random()*(this.marginTop+this.vh) + this.marginTop);
      let img = $('<img>')
      img.css('background', 'red')
      img.css('width', this.picWidth*this.scale)
      img.css('height', this.picHeight*this.scale)
      img.css('position', 'absolute')
      img.css('opacity', 0)
      img.css('top', srcY + 'px')
      img.css('left', srcX + 'px')
      let idx = Math.floor(Math.random()*this.vmHeadCount + 1)
      if(headUrl == "") {
        img.attr('src', 'icon/head/' + idx + ".jpg")
      } else {
        img.attr('src', headUrl)
      }
      $('body').append(img)
      let dstLeft = (this.cellWidth*cell.x + this.marginLeft + this.cellSpace*cell.x/this.pixelUnit)
      let dstTop = (this.cellHeight*cell.y + this.marginTop + this.cellSpace*cell.y/this.pixelUnit)
      setTimeout(function(){
        img.animate(
          { left: dstLeft + 'px', top: dstTop + 'px', width: picWidth + 'px', height: picHeight + 'px', opacity: 1 },
          1000,
          'swing',
          function() {
            if(isLast && that.finish != null) {
              that.finish()
            }
            // $(this).hide()
          }
        );
      }, delay)
    }
  }