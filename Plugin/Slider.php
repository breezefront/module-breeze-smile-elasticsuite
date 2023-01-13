<?php

namespace Swissup\BreezeSmileElasticsuite\Plugin;

class Slider
{
    /** @var \Swissup\Breeze\Helper\Data */
    private $helper;

    public function __construct(
        \Swissup\Breeze\Helper\Data $helper
    ) {
        $this->helper = $helper;
    }

    /**
     * @return string
     */
    public function afterGetTemplate(
        \Smile\ElasticsuiteCatalog\Block\Navigation\Renderer\Slider $subject,
        $result
    ) {
        if (!$this->helper->isEnabled()) {
            return $result;
        }

        return 'Swissup_BreezeSmileElasticsuite::slider.phtml';
    }
}
