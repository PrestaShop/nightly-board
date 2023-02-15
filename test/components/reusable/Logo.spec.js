// eslint-disable no-undef
import { mount, RouterLinkStub } from '@vue/test-utils'
import Logo from '@/components/reusable/Logo.vue'

describe('Logo', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(Logo, {
      stubs: {
        NuxtLink: RouterLinkStub
      }
    })
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
