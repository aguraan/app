<template>
    <v-window-item
        class="text-center"
        @keyup.enter.native="action"
    >
        <v-icon size="140" class="my-5" color="info">mdi-textbox-password</v-icon>
        <v-card-subtitle>
            Создание нового пароля
        </v-card-subtitle>
        <v-divider></v-divider>
        <v-card-text>
            <p>Для смены старого пароля на новый, введите новый пароль в поле ниже.</p>
            <v-form
                ref="resetPasswordForm"
                :value="formValidation"
                @input="formValidationLocal = $event"
                lazy-validation
            >
                <v-text-field
                    :value="password"
                    @input="passwordLocal = $event"
                    :rules="passwordRules"
                    label="Пароль"
                    prepend-icon="mdi-lock"
                    type="password"
                    required
                ></v-text-field>

                <v-text-field
                    :value="repeatPassword"
                    @input="repeatPasswordLocal = $event"
                    :rules="repeatPasswordRules"
                    label="Повторите пароль"
                    prepend-icon="mdi-lock"
                    type="password"
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
                Сохранить
                <v-icon right>mdi-lock-reset</v-icon>
            </v-btn>
        </v-card-actions>
    </v-window-item>
</template>
<script>
export default {
    name: 'PasswordCreate',
    props: ['loading', 'action', 'formValidation', 'back', 'password', 'repeatPassword', 'passwordRules', 'repeatPasswordRules'],
    computed: {
        passwordLocal: {
            get() {
                return this.password
            },
            set(val) {
                this.$emit('update:password', val)
            }
        },
        repeatPasswordLocal: {
            get() {
                return this.repeatPassword
            },
            set(val) {
                this.$emit('update:repeatPassword', val)
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
            return this.$refs.resetPasswordForm.validate()
        }
    },
}
</script>