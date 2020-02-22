<template>
    <v-window-item
        class="text-center"
        @keyup.enter.native="action"
    >
        <v-icon size="140" class="my-5" color="info">mdi-shield-lock</v-icon>
        <v-card-subtitle>
            Восстановление пароля
        </v-card-subtitle>
        <v-divider></v-divider>
        <v-card-text>
            <p>На почту <v-chip :href="`mailto:${ email }`">{{ email }}</v-chip> было отправлено письмо с инструкцией для восстановления пароля.
            Следуйте инструкции для успешного завершения операции.</p>
            <p class="mb-0">Если письмо не пришло, отправьте письмо повторно, нажав на кнопку ниже.</p>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-btn text small @click="back"><v-icon left>mdi-arrow-left-bold</v-icon>Вход</v-btn>
            <v-spacer></v-spacer>
            <v-btn 
                text 
                small 
                :loading="loading"
                @click="action"
            >
                Отправить
                <v-icon right>mdi-email-send-outline</v-icon>
            </v-btn>
        </v-card-actions>
    </v-window-item>
</template>
<script>
export default {
    name: 'PasswordReset',
    props: ['action', 'loading', 'email', 'back']
}
</script>