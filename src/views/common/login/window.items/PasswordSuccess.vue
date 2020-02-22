<template>
    <v-window-item
        class="text-center"
        @keyup.enter.native="back"
        tabindex="1"
    >
        <v-icon size="140" class="my-5" color="success">mdi-shield-check</v-icon>
        <v-card-subtitle>
            Пароль был успешно изменен
        </v-card-subtitle>
        <v-divider></v-divider>
        <v-card-text>
            <p>Восстановление пароля успешно завершено. Теперь Вы можете выполнить вход в свой аккаунт используя новый пароль.</p>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-btn text small @click="back"><v-icon left>mdi-arrow-left-bold</v-icon>Вход</v-btn>
        </v-card-actions>
    </v-window-item>
</template>
<script>
export default {
    name: 'PasswordSuccess',
    props: ['back']
}
</script>