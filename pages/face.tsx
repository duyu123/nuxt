
import { Vue, Component, Ref } from 'vue-property-decorator'
import '~/assets/style/modules/face/face.scss'
import * as faceApi from "face-api.js"
import * as exif from "exif-js"


@Component
export default class FaceComponent extends Vue {
  private fileUrl: String = ''
  private btnText: String = '点击上传图片'
  private dialog: Boolean = false
  private mouthColors: Array<any> = []


  @Ref('fileInput') readonly fileInput
  @Ref('resSection') readonly resSection
  @Ref('resColor') readonly resColor
  @Ref('resText') readonly resText

  mounted() {
    this.initModel()
  }

  private async initModel() {
    try {
      console.log(faceApi.nets.faceLandmark68Net.load('/weights'))
      await faceApi.nets.faceLandmark68Net.load('/weights')
      await faceApi.nets.ssdMobilenetv1.load('/weights')
      console.log("finish")
    } catch(e) {
      this.btnText = "点击上传图片"
    }
  }

  private clickBtn() {
    if(this.btnText) {
      this.fileInput.click()
    }
  }

  private isPC() {
    let userAgentInfo = navigator.userAgent;
    let Agents = ["Android", "iPhone","SymbianOS",
    "Windows Phone","iPad", "iPod"]

    let flag = true;
    for (var v=0; v<Agents.length; v++) {
      if(userAgentInfo.indexOf(Agents[v])>0) {
        flag = false;
        break;
      }
    }

    return flag;
  }

  /**
   * 获取嘴部20个特征点的颜色
   * @param canvans
   * @param mouthPoint
   */
  private getMouthColor(canvans, mouthPoint) {
    let context = canvans.getContext("2d")
    for (let i=0;i<mouthPoint.length;i++) {
      let data = context.getImageData(mouthPoint[i]["_x"], mouthPoint[i]["_y"],1,1);
      this.mouthColors[i] = data.data
    }
  }

  private async startRecognition(canvas) {
    try {
      this.btnText = "识别中..."
      const landmarks = await faceApi.detectSingleFace(canvas).withFaceLandmarks()
      
      let mouthPoint = landmarks.landmarks.getMouth()

      this.getMouthColor(canvas, mouthPoint)
      let lipsticks = require('static/lipstick')

      let compareVal = null;
      let lipstick = null;
      let compareMouthColor = null;

      for (let i=0; i<this.mouthColors.length;i++) {
        let mouthColor = this.mouthColors[i]
        for (let branchItem of lipsticks.brands) {
          for (let seriesItem of branchItem.lipsticks) {
            for (let lipstickItem of seriesItem.lipsticks) {
              let color = this.hex2rgb(lipstickItem.color.toLowerCase())
              let compareTem = this.compareColor(mouthColor[0],mouthColor[1],mouthColor[2],color.r,color.g,color.b)
              if (compareVal === null) {
                compareVal = compareTem;
                lipstick = `${branchItem.name}${seriesItem.name}${lipstickItem.name} #${lipstickItem.id}`
                compareMouthColor = mouthColor
              } else if(compareTem<compareVal) {
                compareVal = compareTem;
                lipstick = `${branchItem.name}${seriesItem.name}${lipstickItem.name} #${lipstickItem.id}`
                compareMouthColor = mouthColor
              }
            }
          }
        }
      }
      this.addResult(compareMouthColor[0],compareMouthColor[1],compareMouthColor[2],compareMouthColor[3],lipstick)
    } catch(e) {
      console.error(e)
      this.dialog = true;
      this.btnText = "点击上传图片"
    }
  }

  private getImageUrl() {
    let file = this.fileInput.files[0]
    if (file !== undefined && file !== null) {
      this.btnText = "解析图片中..."
      this.fileUrl = window.URL.createObjectURL(file);
      console.log(this.isPC())
      if(!this.isPC()) {
        let orientation;
        let ctxThis = this;

        exif.getData(file, function() {
          orientation = exif.getTag(this, "Orientation");
          let reader = new FileReader()
          reader.readAsDataURL(file);
          reader.onload = async (e) => {
            console.log(1)

            if (orientation === 1 || orientation ===undefined) {
              this.fileUrl = window.URL.createObjectURL(file);
              this.btnText = "识别中..."
              // ctxThis.startRecognition()
              return
            }


            let uploadBase64:any = new Image();
            uploadBase64.src = e.target.result;
            uploadBase64.onload = async function () {
              let canvas = document.createElement("canvas")
              canvas.width = this.width
              canvas.height = this.height

              let ctx = canvas.getContext("2d")
              let width = this.width
              let height = this.height
              ctx.drawImage(uploadBase64, 0, 0, width, height);
              if (orientation !== "" && orientation !==1) {
                switch (orientation) {
                  case 6:
                    console.log("顺时针旋转270度");
                    ctxThis.rotateImg(uploadBase64, "left", canvas)
                    break;
                  case 8:
                    console.log("顺时针旋转90度");
                    ctxThis.rotateImg(uploadBase64, "right", canvas)
                    break;
                  case 3:
                    console.log("顺时针旋转180度");
                    ctxThis.rotateImg(uploadBase64, "horizen", canvas);
                    break;
                }
                let base64 = canvas.toDataURL(file.type, 1);
                let newBlob = ctxThis.convertBase64UrlToBlob(base64);
                ctxThis.fileUrl = await window.URL.createObjectURL(newBlob)
              }
              ctxThis.startRecognition(canvas)
            }
          }
        })
      } else {
        this.fileUrl = window.URL.createObjectURL(file)
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = async (e) => {
          let uploadBase64: any = new Image();
          uploadBase64.src = e.target.result;
          let that = this;
          uploadBase64.onload = async function() {
            let canvas = document.createElement("canvas")
            canvas.width = this.width
            canvas.height = this.height
            let ctx = canvas.getContext("2d")
            let width = this.width
            let height = this.height

            ctx.drawImage(uploadBase64, 0, 0, width, height)
            that.startRecognition(canvas)
          }
        }
      }
    }
  }

  private addResult(r,g,b,a,text) {
    this.resSection.style.visibility="visible"
    this.resColor.style.background = `rgba(${r},${g},${b},${a})`
    this.resText.innerText = text
    this.btnText = "点击上传图片"
  }

  private rgba2hex(r,g,b) {
    if (r > 255 || g > 255 || b > 255) {
      throw "Invalid color component";
    }

    return "#" + ((1 << 24) + (r << 16) +(g << 8) + b).toString(16).slice(1).toUpperCase();
  }

  private hex2rgb(hex) {
    let m = hex.match(/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
    return {
      r: parseInt(m[1], 16),
      g: parseInt(m[2], 16),
      b: parseInt(m[3], 16)
    };
  }

  /**
   * 颜色差距计算
   * @param r1
   * @param g1
   * @param b1
   * @param r2
   * @param g2
   * @param b2
   * @returns {number}
   */
  private compareColor (r1,g1,b1,r2,g2,b2){
    let r = Math.pow((r1-r2),2)
    let g = Math.pow((g1-g2),2)
    let b = Math.pow((b1-b2),2)
    return Math.sqrt((r+g+b))
  }

  private rotateImg (img, direction,canvas){
    console.log("开始旋转图片");
    //图片旋转4次后回到原方向
    if (img == null) return;
    var height = img.height;
    var width = img.width;
    var step = 2;

    if (direction == "right") {
      step++;
    } else if (direction == "left") {
      step--;
    } else if (direction == "horizen") {
      step = 2; //不处理
    }
    //旋转角度以弧度值为参数
    var degree = step * 90 * Math.PI / 180;
    var ctx = canvas.getContext("2d");
    switch (step) {
      case 0:
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0);
        break;
      case 1:
        canvas.width = height;
        canvas.height = width;
        ctx.rotate(degree);
        ctx.drawImage(img, 0, -height);
        break;
      case 2:
        canvas.width = width;
        canvas.height = height;
        ctx.rotate(degree);
        ctx.drawImage(img, -width, -height);
        break;
      case 3:
        canvas.width = height;
        canvas.height = width;
        ctx.rotate(degree);
        ctx.drawImage(img, -width, 0);
        break;
    }
    console.log("结束旋转图片");
  }

  private convertBase64UrlToBlob(urlData) {
    let bytes = window.atob(urlData.split(',')[1]);

    let ab = new ArrayBuffer(bytes.length);
    let ia = new Uint8Array(ab);

    for (var i=0; i<bytes.length; i++) {
      ia[i] = bytes.charCodeAt(i)
    }

    return new Blob( [ab], {type: 'image/png'})
  }

  /**
   * 上口红
   * @param image
   * @param mouthPoint
   * @param r
   * @param g
   * @param b
   * @returns {null}
   */

  pubLipstice(image, mouthPoint, r,g,b) {
    if(image instanceof Image) {
      let canvas = faceApi.createCanvasFromMedia(image)
      let ctx = canvas.getContext("2d")
      //画上嘴唇
      for (let i=0; i<7;i++) {
        if (i === 0) {
          ctx.moveTo(mouthPoint[i]["_x"],mouthPoint[i]["_y"])
        } else {
          ctx.lineTo(mouthPoint[i]["_x"],mouthPoint[i]["_y"])
        }
      }

      for (let i=16; i>=14;i--) {
        if(i === 6) {
          ctx.moveTo(mouthPoint[i]["_x"],mouthPoint[i]["_y"]);
        } else {
          ctx.lineTo(mouthPoint[i]["_x"],mouthPoint[i]["_y"]);
        }
      }

      for (let i =19 ;i>=17;i--){
        ctx.lineTo(mouthPoint[i]["_x"],mouthPoint[i]["_y"]);
      }
      ctx.closePath();
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fill();

      canvas.toBlob(function(blob){
        // 涂口红的效果
        console.log(URL.createObjectURL(blob))
        return URL.createObjectURL(blob)
      })
    }
    return null
  }
  


  public render() {
    return (
      <div class='container'>
        <div class='container__mobile'>
          <img src={require('~/assets/image/face.png')}
            class='container__mobile--image' />
        </div>

        <input 
          type="file" 
          accept="image/*" 
          class="img-input" 
          onChange={this.getImageUrl} 
          ref="fileInput" />

        <button onClick={this.clickBtn} class="btn">{ this.btnText }</button>

        <div class="res-section" ref="resSection">
          <div class="res-color" ref="resColor"></div>
          <span class="res-text" ref="resText"></span>
        </div>
      </div>

      
    );
  }
}

