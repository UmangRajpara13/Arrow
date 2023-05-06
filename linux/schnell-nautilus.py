# Arrow Nautilus Extension
#
# Place me in ~/.local/share/nautilus-python/extensions/,
# ensure you have python-nautilus package, restrart Nautilus, and enjoy :)

from gi import require_version
require_version('Gtk', '3.0')
require_version('Nautilus', '3.0')
from gi.repository import Nautilus, GObject
from subprocess import call
import os

# path to arrow
arrow = 'arrow'

# what name do you want to see in the context menu?
arrowname = 'Arrow Console'

# always create new window?
NEWWINDOW = False


class ArrowExtension(GObject.GObject, Nautilus.MenuProvider):

    def arrowname(self, menu, files):
        safepaths = ''

        for file in files:
            filepath = file.get_location().get_path()
            safepaths += '"' + filepath + '" '

            # If one of the files we are trying to open is a folder
            # create a new instance of arrow


        call(arrow + ' ' + safepaths + '&', shell=True)

    def get_file_items(self, window, files):
        item = Nautilus.MenuItem(
            name='ArrowOpen',
            label='Open In ' + arrowname,
            tip='Opens the selected files with Arrow'
        )
        item.connect('activate', self.arrowname, files)

        return [item]

    def get_background_items(self, window, file_):
        item = Nautilus.MenuItem(
            name='ArrowOpenBackground',
            label='Open in ' + arrowname,
            tip='Opens Arrow in the current directory'
        )
        item.connect('activate', self.arrowname, [file_])

        return [item]
