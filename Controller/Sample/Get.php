<?php
namespace Cogensoft\Swatches\Controller\Sample;

use \Magento\Framework\App\Action\Action;

class Get extends Action
{
	protected $_pageFactory;

	public function __construct(
		\Magento\Framework\App\Action\Context $context,
		\Magento\Framework\View\Result\PageFactory $pageFactory)
	{
		$this->_pageFactory = $pageFactory;
		return parent::__construct($context);
	}

	public function execute()
	{
		header ('Content-Type: image/png');
		header("Cache-Control: max-age=2592000"); //30days
		$im = @imagecreatetruecolor(32, 32)
		or die('Cannot Initialize new GD image stream');

		$hexColours = isset($_GET['colour']) ? strtolower($_GET['colour']) : 'ffffff';
		$hexColourParts = str_split($hexColours);
		switch(strlen($hexColours)) {
			case 3:
				$red = hexdec((string) ($hexColourParts[0].$hexColourParts[0]));
				$green = hexdec((string) ($hexColourParts[1].$hexColourParts[1]));
				$blue = hexdec((string) ($hexColourParts[2].$hexColourParts[2]));
				break;
			case 6:
				$red = hexdec((string) ($hexColourParts[0].$hexColourParts[1]));
				$green = hexdec((string) ($hexColourParts[2].$hexColourParts[3]));
				$blue = hexdec((string) ($hexColourParts[4].$hexColourParts[5]));
				break;
			default:
				die('Invalid colour hex value');
		}

		$background = imagecolorallocate($im, $red, $green, $blue);
		imagefill($im, 0, 0, $background);
		imagepng($im);
		imagedestroy($im);
	}
}