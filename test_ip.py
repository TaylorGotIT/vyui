# !/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time    : 2023/10/10 14:54
# @Author  : taylorgogo
# @Site    :
# @File    : test_ip.py
# @Software: PyCharm
from netaddr import spanning_cidr

ip_range = input("IP Address Range: ")
split_by = input("Split By:")
ips = ip_range.split(split_by)
subnet = spanning_cidr(ips)

print(subnet)
