
import { Vue, Component } from 'vue-property-decorator'
import drmsIcon from '@/components/icon/index.tsx'
import '~/assets/style/modules/index/index.scss'


@Component({
  components: {
    "drms-icon": drmsIcon
  }
})



export default class IndexComponent extends Vue {

  public render() {
    return (
      <div class='container'>
        <drms-icon text="a" />
      </div>
    );
  }
}

