<template>
    <v-window-item
        class="text-center"
    >
        <v-icon size="140" class="my-5" color="error">mdi-account-off</v-icon>
        <v-card-subtitle>
            Аккаунт не подтвержден
        </v-card-subtitle>
        <v-divider></v-divider>
        <v-card-text>
            <p>Аккаунт не был подтвержден. Для его подтверждения, введите адрес эл. почты, который соответствует Вашему аккаунту.</p>
            <v-form
                ref="form"
                :value="formValidation"
                @input="formValidationLocal = $event"
                @keyup.enter.native="action"
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
    name: 'AccountNotConfirmed',
    props: ['action', 'back', 'email', 'emailRules', 'formValidation', 'loading'],
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
            return this.$refs.form.validate()
        }
    }
}
</script>