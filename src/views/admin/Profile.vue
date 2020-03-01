<template>
    <v-container>
        <v-row>
            <v-col>
                <v-row>
                    <v-col cols="4" class="text-center">
                        <v-card  tile class="pa-12">
                            <v-avatar
                                size="200"
                            >
                                <v-img :src="user.picture"></v-img>
                            </v-avatar>
                        </v-card>
                    </v-col>
                    <v-col>
                        <v-card  tile>
                            <v-card-title>
                                <span class="subtitle-1">Контактная информация</span>
                            </v-card-title>
                            <v-card-text>

                                <v-list>
                                    <v-list-item>
                                        <v-list-item-icon>
                                            <v-icon>mdi-account-star</v-icon>
                                        </v-list-item-icon>

                                        <v-list-item-content>
                                            <v-list-item-subtitle>Роль</v-list-item-subtitle>
                                            <v-list-item-title>{{ user.roleRu }}</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>

                                    <v-divider></v-divider>

                                    <v-list-item>
                                        <v-list-item-icon>
                                            <v-icon>mdi-account</v-icon>
                                        </v-list-item-icon>

                                        <v-list-item-content>
                                            <v-list-item-subtitle>Имя</v-list-item-subtitle>
                                            <v-list-item-title>{{ user.name || user.givenName }}{{ user.username ? ` | ${user.username}` : ''}}</v-list-item-title>
                                        </v-list-item-content>

                                        <v-list-item-action>
                                            <v-dialog v-model="nameDialog" persistent max-width="600px">

                                                <template v-slot:activator="{ on }">
                                                    <v-btn icon v-on="on">
                                                        <v-icon>mdi-pencil</v-icon>
                                                    </v-btn>
                                                </template>

                                                <v-card>
                                                    <v-card-title>
                                                        <span class="headline">Имя и Никнейм</span>
                                                    </v-card-title>
                                                    <v-card-text>
                                                        <v-container>
                                                            <v-row>
                                                                <v-col cols="12" sm="6" md="4">
                                                                    <v-text-field label="Имя" v-model.trim="editedUser.givenName"></v-text-field>
                                                                </v-col>
                                                                <v-col cols="12" sm="6" md="4">
                                                                    <v-text-field label="Фамилия" v-model.trim="editedUser.familyName"></v-text-field>
                                                                </v-col>
                                                                <v-col cols="12" sm="6" md="4">
                                                                    <v-text-field label="Никнейм" v-model.trim="editedUser.username"></v-text-field>
                                                                </v-col>
                                                            </v-row>
                                                        </v-container>
                                                    </v-card-text>
                                                    <v-card-actions>
                                                        <v-spacer></v-spacer>
                                                        <v-btn color="blue darken-1" text @click="nameDialog = false">Закрыть</v-btn>
                                                        <v-btn color="blue darken-1" text @click="editName">Сохранить</v-btn>
                                                    </v-card-actions>
                                                </v-card>
                                            </v-dialog>
                                        </v-list-item-action>
                                    </v-list-item>

                                    <v-divider></v-divider>

                                    <v-list-item>
                                        <v-list-item-icon>
                                            <v-icon>mdi-email</v-icon>
                                        </v-list-item-icon>

                                        <v-list-item-content>
                                            <v-list-item-subtitle>Адрес эл. почты</v-list-item-subtitle>
                                            <v-list-item-title>
                                                <v-chip :href="`mailto:${ user.email }`">{{ user.email }}</v-chip>
                                            </v-list-item-title>
                                        </v-list-item-content>

                                        <v-list-item-action>
                                            <v-btn icon @click="editContact">
                                                <v-icon>mdi-pencil</v-icon>
                                            </v-btn>
                                        </v-list-item-action>
                                    </v-list-item>

                                </v-list>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row>
            <v-col cols="4">
                <v-card :loading="operations[`patch:/api/accounts/google/${ this.user.google_id }`]"  tile>
                    <v-card-title class="subtitle-1">Авторизация с Google</v-card-title>
                    <v-card-subtitle>Области видимости:</v-card-subtitle>
                    <v-card-text>
                        <v-list dense>
                            <template v-for="(scope, index) in googleScope">
                                <div :key="index">
                                    <v-list-item>
                                        <v-list-item-content>
                                            <span>{{ scope }}</span>
                                        </v-list-item-content>

                                        <v-list-item-icon>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <v-btn icon small @click="removeScope(index)" v-on="on">
                                                        <v-icon>mdi-minus</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>Удалить</span>
                                            </v-tooltip>
                                        </v-list-item-icon>
                                    </v-list-item>
                                    <v-divider></v-divider>
                                </div>
                            </template>
                        </v-list>

                        <v-text-field v-model="scopeInput" @keypress.enter="addScope" ref="scopeInput">
                            <v-tooltip bottom slot="append">
                                <template v-slot:activator="{ on }">
                                    <v-btn icon small @click="addScope" :disabled="hasScopeInput" v-on="on">
                                        <v-icon>mdi-plus</v-icon>
                                    </v-btn>
                                </template>
                                <span>Добавить</span>
                            </v-tooltip>
                        </v-text-field>

                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            @click="authorizeGoogle"
                            small
                            text
                            color="primary"
                            :loading="operations['post:/auth/google']"
                        >
                            <v-icon right>mdi-google</v-icon>
                            Авторизоваться
                        </v-btn>
                        <v-spacer></v-spacer>
                    </v-card-actions>
                </v-card>
            </v-col>
            <v-col cols="4">
                <v-card tile>
                    <v-card-title class="subtitle-1">Ваши устройства</v-card-title>
                    <v-card-subtitle>Вы вошли в свой аккаунт Scheme на этих устройствах:</v-card-subtitle>
                    <v-card-text>
                        <v-list three-line>
                            <template v-for="(session, index) in userSessions">
                                <div :key="index">
                                    <v-list-item>
                                        <v-list-item-avatar>
                                            <v-icon v-if="!session.device.type">mdi-help</v-icon>
                                            <v-icon v-else-if="session.device.type === 'desktop'">mdi-laptop</v-icon>
                                            <v-icon v-else>mdi-cellphone</v-icon>
                                        </v-list-item-avatar>

                                        <v-list-item-content>

                                            <v-list-item-title v-if="session.os.name">{{ session.os.name }}</v-list-item-title>
                                            <v-list-item-title v-else>Неизвестное устройство</v-list-item-title>

                                            <v-list-item-subtitle>
                                                <v-icon small class="mr-1">{{ session.client.icon }}</v-icon>
                                                <span v-if="session.client.name">{{ session.client.name }}</span>
                                            </v-list-item-subtitle>

                                            <v-list-item-subtitle>{{ new Date(session.updatedAt).toLocaleString('ru', dateOptions) }}</v-list-item-subtitle>

                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-divider></v-divider>
                                </div>
                            </template>
                        </v-list>

                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { 
    GOOGLE_AUTH,
    UPDATE_GOOGLE_DATA,
    UPDATE_USER
} from '@/mutation.types'
import { mapGetters } from 'vuex'

export default {
    name: 'AdminProfile',
    data: () => ({
        scopeInput: '',
        googleScope: [],
        userSessions: [],
        nameDialog: false,
        emailDialog: false,
        editedUser: {},
        dateOptions: {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'short',
            timezone: 'Europe/Kiev',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        }

    }),
    async created() {
        if (this.googleData)                this.googleScope =  this.googleData.scope
        if (this.user.id in this.sessions)  this.userSessions = this.sessions[this.user.id]

        this.editedUser = {
            givenName: this.user.givenName,
            familyName: this.user.familyName,
            username: this.user.username
        }
    },
    computed: {
        ...mapGetters(['user', 'operations', 'googleData', 'sessions']),
        hasScopeInput() {
            return !this.scopeInput
        },
    },
    methods: {
        async addScope() {
            if (this.scopeInput) {
                try {
                    await this.$store.dispatch(UPDATE_GOOGLE_DATA, {
                        id: this.user.google_id,
                        googleUpdate: {
                            scope: [ ...this.googleScope, this.scopeInput ]
                        }
                    })
                    this.googleScope = this.googleData.scope
                    this.scopeInput = ''
                    this.$refs.scopeInput.focus()
                } catch (error) {
                    //
                }
            }
        },
        async removeScope(index) {
            const message = `Удалить область видимости? \nК удалению: ${ this.googleScope[index] }`
            const confirmed = window.confirm(message)
            if (confirmed) {
                try {
                    await this.$store.dispatch(UPDATE_GOOGLE_DATA, {
                        id: this.user.google_id,
                        googleUpdate: {
                            scope: this.googleScope.filter((scope, i) => i !== index)
                        }
                    })
                    this.googleScope = this.googleData.scope
                } catch (error) {
                    //
                }
            }
        },
        async authorizeGoogle() {
            try {
                await this.$store.dispatch(GOOGLE_AUTH, {
                    scope: this.googleScope,
                    consent: true
                })
            } catch (error) {
                //
            }
        },
        editContact() {
            /* eslint-disable */
            console.log('works')
        },
        async editName() {
            try {
                await this.$store.dispatch(UPDATE_USER, {
                    id: this.user.id,
                    userUpdate: this.editedUser
                })
                this.nameDialog = false
            } catch (error) {
                this.editedUser = {
                    givenName: this.user.givenName,
                    familyName: this.user.familyName,
                    username: this.user.username
                }
            }
        }
    },
}
</script>