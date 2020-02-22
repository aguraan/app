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
                                    <v-list-item @click="editContact">
                                        <v-list-item-icon>
                                            <v-icon>mdi-account-star</v-icon>
                                        </v-list-item-icon>

                                        <v-list-item-content>
                                            <v-list-item-subtitle>Роль</v-list-item-subtitle>
                                            <v-list-item-title>{{ user.roleRu }}</v-list-item-title>
                                        </v-list-item-content>

                                        <v-list-item-action>
                                            <v-icon>mdi-pencil</v-icon>
                                        </v-list-item-action>
                                    </v-list-item>

                                    <v-divider></v-divider>

                                    <v-list-item @click="editContact">
                                        <v-list-item-icon>
                                            <v-icon>mdi-account</v-icon>
                                        </v-list-item-icon>

                                        <v-list-item-content>
                                            <v-list-item-subtitle>Имя</v-list-item-subtitle>
                                            <v-list-item-title>{{ user.name || user.username || user.givenName }}</v-list-item-title>
                                        </v-list-item-content>

                                        <v-list-item-action>
                                            <v-icon>mdi-pencil</v-icon>
                                        </v-list-item-action>
                                    </v-list-item>

                                    <v-divider></v-divider>

                                    <v-list-item @click="editContact">
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
                                            <v-icon>mdi-pencil</v-icon>
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
        </v-row>
    </v-container>
</template>

<script>
import { 
    GOOGLE_AUTH,
    UPDATE_GOOGLE_DATA 
} from '@/mutation.types'
import { mapGetters } from 'vuex'
export default {
    name: 'AdminProfile',
    data: () => ({
        scopeInput: '',
        googleScope: []
    }),
    async created() {
        if (this.googleData) {
            this.googleScope = this.googleData.scope
        }
    },
    computed: {
        ...mapGetters(['user', 'operations', 'googleData']),
        hasScopeInput() {
            return !this.scopeInput
        }
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
            
        }
    },
}
</script>