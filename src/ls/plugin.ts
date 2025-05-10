import { ILanguageServerPlugin, IConnectionDriverConstructor } from '@sqltools/types';
import CacheDriver from './driver';
import { DRIVER_ALIASES } from './../constants';

const CacheDriverPlugin: ILanguageServerPlugin = {
  register(server) {
    DRIVER_ALIASES.forEach(({ value }) => {
      server.getContext().drivers.set(value, CacheDriver as IConnectionDriverConstructor);
    });
  }
}

export default CacheDriverPlugin;
