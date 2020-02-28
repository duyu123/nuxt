
import { Vue, Component, Prop } from 'vue-property-decorator'
import IconComponent from '@/components/icon/index.tsx'
import '@/style/modules/index/index.scss'

interface User {
  firstName: string
  lastName: number
}

@Component
export default class YourComponent extends Vue {
@Prop({ type: Object, required: true }) readonly user!: User

message: string = 'This is a message'

get fullName (): string {
  return `${this.user.firstName} ${this.user.lastName}`
}

public render() {
  return (
    <div>
      222
      <IconComponent svg="{icon: 'a'}" />
    </div>
  );

}
}

