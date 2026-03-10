import React from 'react';
import { useCMS } from '../../store/CMSContext';
import { SiteConfigEditor } from '../../components/admin/SiteConfigEditor';

export function ConfigPage() {
  const { siteConfig, updateSiteConfig } = useCMS();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-navy">Configurações do Site</h1>
      <SiteConfigEditor config={siteConfig} onSave={updateSiteConfig} />
    </div>
  );
}
