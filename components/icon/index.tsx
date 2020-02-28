
import { Vue, Component, Prop } from 'vue-property-decorator'
import './index.scss'

interface Svg {
  icon: string
}

@Component
export default class IconComponent extends Vue {
  @Prop({ type: Object, required: true }) readonly svg!: Svg

  public render() {
    return (
        <svg className="icon" aria-hidden="true">
          <use xlink:href="{`#icon-${this.svg.icon}`}"></use>
        </svg>
    )
  }
}

