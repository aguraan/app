<template>
    <v-window-item
        class="text-center"
        @keyup.enter.native="action"
    >
        <v-icon size="140" class="my-5" color="info">mdi-lock-question</v-icon>
        <v-card-subtitle>
            Забыли пароль?
        </v-card-subtitle>
        <v-divider></v-divider>
        <v-card-text>
            <p>Введите адрес эл. почты на которое будет отправлено письмо с инструкцией для восстановления Вашего пароля.</p>
            <v-form
                ref="resetEmailForm"
                :value="formValidation"
                @input="formValidationLocal = $event"
                lazy-validation
            >
                <v-text-field
                    :value="email"
                    @input="emailLocal = $event"
                    :rules="emailRules"
                    label="Ваш адрес эл. почты"
                    prepend-icon="mdi-email"
                    type="email"
                    required
                ></v-text-field>
            </v-form>
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
                Продолжить
                <v-icon right>mdi-arrow-right-bold</v-icon>
            </v-btn>
        </v-card-actions>
    </v-window-item>
</template>
<script>
export default {
    name: 'ForgotPassword',
    props: ['action', 'formValidation', 'email', 'emailRules', 'back', 'loading'],
    computed: {
        emailLocal: {
            get() {
                return this.email
            }, 
            set(val) {
                this.$emit('update:email', val)
            }
        },
        formValidationLocal: {
            get() {
                return this.formValidation
            },
            set(val) {
                this.$emit('update:formValidation', val)
            }
        }
    },
    methods: {
        validate() {
            return this.$refs.resetEmailForm.validate()
        }
    }
}
</script>