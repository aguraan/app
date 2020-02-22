<template>
    <v-window-item
        class="text-center"
        @keyup.enter.native="action"
        :value="value"
    >
        <v-icon size="140" class="my-5" color="warning">mdi-account-alert</v-icon>
        <v-card-subtitle>
            Подтвердите Ваш аккаунт
        </v-card-subtitle>
        <v-divider></v-divider>
        <v-card-text>
            <p>На почту <v-chip :href="`mailto:${ email }`">{{ email }}</v-chip> было отправлено письмо с инструкцией для дальнейшего подтверждения Вашего аккаунта.
            Следуйте инструкции для успешного завершения регистрации.</p>
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
    name: 'AccountConfirmation',
    props: ['email', 'back', 'loading', 'action', 'value'],
}
</script>