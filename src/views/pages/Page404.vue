<template>
    <div>
        <v-app-bar
			app
			color="primary"
			dark
		>

		</v-app-bar>

		<v-content>
			<router-view></router-view>
		</v-content>
    </div>
</template>

<script>
export default {
    name: 'Page404'
}
</script>