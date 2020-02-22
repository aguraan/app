<template>
	<v-content>
		<v-container fill-height>
			<v-row justify="center" no-gutters>
				<v-col cols="auto" class="text-center grey--text">

					<h1 class="display-2">Ошибка 404</h1>
					<h3 class="headline mb-5">Не найдено</h3>
					<v-btn text small @click="$router.go(-1)"><v-icon left>mdi-arrow-left-bold</v-icon>Вернуться</v-btn>
				</v-col>
			</v-row>
		</v-container>
	</v-content>
</template>

<script>
export default {
    name: 'Page404'
}
</script>