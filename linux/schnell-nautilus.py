# Sonic Nautilus Extension
#
# Place me in ~/.local/share/nautilus-python/extensions/,
# ensure you have python-nautilus package, restrart Nautilus, and enjoy :)

from gi import require_version
require_version('Gtk', '3.0')
require_version('Nautilus', '3.0')
from gi.repository import Nautilus, GObject
from subprocess import call
import os

# path to sonic
sonic = 'sonic'

# what name do you want to see in the context menu?
sonicname = 'Sonic Console'

# always create new window?
NEWWINDOW = False


class SonicExtension(GObject.GObject, Nautilus.MenuProvider):

    def sonicname(self, menu, files):
        safepaths = ''

        for file in files:
            filepath = file.get_location().get_path()
            safepaths += '"' + filepath + '" '

            # If one of the files we are trying to open is a folder
            # create a new instance of sonic


        call(sonic + ' ' + safepaths + '&', shell=True)

    def get_file_items(self, window, files):
        item = Nautilus.MenuItem(
            name='SonicOpen',
            label='Open In ' + sonicname,
            tip='Opens the selected files with Sonic'
        )
        item.connect('activate', self.sonicname, files)

        return [item]

    def get_background_items(self, window, file_):
        item = Nautilus.MenuItem(
            name='SonicOpenBackground',
            label='Open in ' + sonicname,
            tip='Opens Sonic in the current directory'
        )
        item.connect('activate', self.sonicname, [file_])

        return [item]
