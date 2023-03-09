//@ts-ignore
import { prefixPluginTranslations } from '@strapi/helper-plugin';
import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import pluginPermissions from './permissions';
import NavigationIcon from './components/icons/navigation';
import trads, { TranslationKey, Translations } from './translations';
import { get } from 'lodash';
import { StrapiAdminInstance } from 'strapi-typed';
const name = pluginPkg.strapi.name;

export default {
  register(app: StrapiAdminInstance) {
    app.createSettingSection(
      {
        id: pluginId,
        intlLabel: { 
          id: `${pluginId}.pages.settings.section.title`, 
          defaultMessage: 'Navigation Plugin'
        },
      },
      [
        {
          intlLabel: {
            id: `${pluginId}.pages.settings.section.subtitle`,
            defaultMessage: 'Configuration',
          },
          id: 'navigation',
          to: `/settings/${pluginId}`,
          Component: async () => {
            const component = await import(
              /* webpackChunkName: "navigation-settings" */ './pages/SettingsPage'
            );
    
            return component;
          },
          permissions: pluginPermissions.access,
        }
      ]);
    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: NavigationIcon,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: 'Navigation',
      },
      Component: async () => {
        const component = await import(/* webpackChunkName: "navigation-main-app" */ './pages/App');

        return component;
      },
      permissions: pluginPermissions.access,
    });
    app.registerPlugin({
      id: pluginId,
      name,
    });
  },
  bootstrap() {},
  // async registerTrads({ locales }) {
  //   const importedTrads = await Promise.all(
  //     locales.map(locale => {
  //       return import(
  //         /* webpackChunkName: "[pluginId]-[request]" */ `./translations/${locale}.json`
  //       )
  //         .then(({ default: data }) => {
  //           return {
  //             data: prefixPluginTranslations(data, pluginId),
  //             locale,
  //           };
  //         })
  //         .catch(() => {
  //           return {
  //             data: {},
  //             locale,
  //           };
  //         });
  //     })
  //   );

  //   return Promise.resolve(importedTrads);
  // },
  registerTrads({ locales }: { locales: Array<TranslationKey>}) {
    return locales.map((locale: string) => {
      return {
        data: prefixPluginTranslations(get<Translations, TranslationKey>(trads, locale as TranslationKey), pluginId, {}),
        locale,
      };
    });
  },
};
