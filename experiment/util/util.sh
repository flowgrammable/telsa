sudo apt-get update -y
sudo apt-get -y install graphviz autoconf libtool openssl
cd /home/vagrant/
wget -q https://github.com/openvswitch/ovs/archive/v2.3.1.tar.gz
tar xfz v2.3.1.tar.gz
rm v2.3.1.tar.gz
cd /home/vagrant/ovs-2.3.1
./boot.sh
./configure --with-linux=/lib/modules/`uname -r`/build
make
sudo make install
sudo make modules_install
sudo /sbin/modprobe openvswitch

sudo touch /var/log/ovs-vswitchd.log
sudo ovsdb-server --remote=punix:/usr/local/var/run/openvswitch/db.sock \
                  --remote=db:Open_vSwitch,Open_vSwitch,manager_options \
                  --log-file=/var/log/ovs-vswitchd.log --pidfile --detach
sudo ovs-vsctl --no-wait init
sudo ovs-vswitchd --pidfile --detach

# Create the initial files necessary for operation
sudo mkdir -p /usr/local/etc/openvswitch
sudo ovsdb-tool create /usr/local/etc/openvswitch/conf.db vswitchd/vswitch.ovsschema

