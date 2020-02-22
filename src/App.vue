<template>
	<v-app :style="background">
		<router-view></router-view>
	</v-app>
</template>

<script>
import {
	// SELECT_THEME,
	// SET_DARK_MODE
} from '@/mutation.types'
import { mapGetters } from 'vuex'
export default {
	name: 'App',
	created() {
		// this.$store.commit(SELECT_THEME, this.$storage.get('theme') || 0)
		// this.$store.commit(SET_DARK_MODE, this.$storage.get('dark') || false)
	},
	computed: {
		...mapGetters(['selectedTheme']),
		background() {
			if (this.selectedTheme) {
				return { backgroundImage: `url(${ require('@/assets/themes/img_' + this.selectedTheme + '.jpg') })` }
			}
			return {}
		}
	},
}
</script>