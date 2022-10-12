import React from 'react'
import { useTranslation } from 'react-i18next'
import { ToggleSwitch } from '/src/frontend/components/UI'
import useSetting from '/src/frontend/hooks/useSetting'

const DownloadNoHTTPS = () => {
  const { t } = useTranslation()
  const [downloadNoHttps, setDownloadNoHttps] = useSetting<boolean>(
    'downloadNoHttps',
    false
  )

  return (
    <ToggleSwitch
      htmlId="downloadNoHttps"
      value={downloadNoHttps}
      handleChange={() => setDownloadNoHttps(!setDownloadNoHttps)}
      title={t(
        'setting.download-no-https',
        'Download games without HTTPS (useful for CDNs e.g. LanCache)'
      )}
    />
  )
}

export default DownloadNoHTTPS
