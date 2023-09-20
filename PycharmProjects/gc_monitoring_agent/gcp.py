#pip install --upgrade google-api-python-client
#pip install --upgrade google-cloud-monitoring

import time, os
from time import strftime, localtime
from google.cloud import monitoring_v3
from google.protobuf.timestamp_pb2 import Timestamp
import datetime

def set_credentials(filepath):
    os.environ.setdefault('GOOGLE_APPLICATION_CREDENTIALS', filepath)


def print_list():
    client = monitoring_v3.MetricServiceClient()
    project_name = f"projects/hycloud-399403"

    """
    모니터링 리소스 나열 > 모니터링할 수 있는 클라우드 항목"""
    resource_descriptors = client.list_monitored_resource_descriptors(name=project_name)
    for descriptor in resource_descriptors:
        print(descriptor.type)

    """
    클라우드 항목 중 세부 metric 유형 나열"""
    for descriptor in client.list_metric_descriptors(name=project_name):
        print(descriptor.type)

def print_get():
    client = monitoring_v3.MetricServiceClient()
    project_name = f"projects/hycloud-399403"

    now = time.time()
    tm = localtime(now)

    seconds = int(now)
    nanos = int((now - seconds) * 10 ** 9)
    interval = monitoring_v3.TimeInterval(
        {
            "end_time": {"seconds": seconds, "nanos": nanos},
            "start_time": {"seconds": (seconds - 120), "nanos": nanos},
        }
    )

    results = client.list_time_series(
        request={
            "name": project_name,
            #agent.googleapis.com/memory/bytes_used
            #agent.googleapis.com/memory/percent_used
            #"filter": 'metric.type = "compute.googleapis.com/instance/cpu/utilization" AND metric.label.instance_name = "test-vm"',
            "filter": 'metric.type = "agent.googleapis.com/memory/percent_used" AND resource.labels.instance_id = ""',
            #"filter": 'metric.type = "agent.googleapis.com/cpu/utilization"',
            "interval": interval,
            "view": monitoring_v3.ListTimeSeriesRequest.TimeSeriesView.FULL,
        }
    )
    for result in results:
        print(result)

def get_instance_name(project_id, zone, instance_id):
    client = monitoring_v3.MetricServiceClient()

    # 인스턴스 ID를 리소스 경로로 변환
    resource_name = f"projects/{project_id}/zones/{zone}/instances/{instance_id}"

    # 현재 시간을 가져와서 endTime으로 사용
    end_time = Timestamp()
    end_time.FromDatetime(datetime.datetime.utcnow())

    now = time.time()
    tm = localtime(now)

    seconds = int(now)
    nanos = int((now - seconds) * 10 ** 9)
    interval = monitoring_v3.TimeInterval(
        {
            "end_time": {"seconds": seconds, "nanos": nanos},
            "start_time": {"seconds": (seconds - 120), "nanos": nanos},
        }
    )

    # 메트릭 쿼리 생성 (메트릭 종류를 지정하여 더 구체적으로 필터링)
    query = f'resource.type="gce_instance" AND resource.labels.instance_id="{resource_name}" ' \
            f'AND metric.type="compute.googleapis.com/instance/cpu/utilization"'

    # 메트릭 시계열 조회
    results = client.list_time_series(
        name=f"projects/{project_id}",
        filter=query,
        interval=interval,
    )

    # 인스턴스 이름 가져오기
    for result in results:
        resource = result.resource
        if resource.type == 'gce_instance':
            return resource.labels.get('instance_name', 'Instance not found')

    return 'Instance not found'


def get_cpu_utilization(project_id):

    client = monitoring_v3.MetricServiceClient()
    project_name = f"projects/{project_id}"

    now = time.time()
    tm = localtime(now)

    seconds = int(now)
    nanos = int((now - seconds) * 10 ** 9)
    interval = monitoring_v3.TimeInterval(
        {
            "end_time": {"seconds": seconds, "nanos": nanos},
            "start_time": {"seconds": (seconds - 120), "nanos": nanos},
        }
    )

    results = client.list_time_series(
        request={
            "name": project_name,
            "filter": 'metric.type = "agent.googleapis.com/cpu/utilization"',
            "interval": interval,
            "view": monitoring_v3.ListTimeSeriesRequest.TimeSeriesView.FULL,
        }
    )
    result_list = []
    for result in results:
        if result.metric.labels.get("cpu_state") == "idle":
            _dict = {}
            _dict["vendor"] = "gcp"
            _dict["instance_id"] = result.resource.labels.get("instance_id")
            _dict["instance_name"] = result.resource.type
            _dict["metric"] = "cpu"
            _dict["value"] = round(100 - result.points[0].value.double_value, 1)
            _dict["time"] = strftime('%Y-%m-%d %I:%M:%S %p', tm)
            _dict["time_key"] = strftime('%Y%m%d%I%M%S', tm)
            result_list.append(_dict)

    return result_list

def get_memory_utilization(project_id):

    client = monitoring_v3.MetricServiceClient()
    project_name = f"projects/{project_id}"

    now = time.time()
    tm = localtime(now)

    seconds = int(now)
    nanos = int((now - seconds) * 10 ** 9)
    interval = monitoring_v3.TimeInterval(
        {
            "end_time": {"seconds": seconds, "nanos": nanos},
            "start_time": {"seconds": (seconds - 120), "nanos": nanos},
        }
    )

    results = client.list_time_series(
        request={
            "name": project_name,
            "filter": 'metric.type = "agent.googleapis.com/memory/percent_used"',
            "interval": interval,
            "view": monitoring_v3.ListTimeSeriesRequest.TimeSeriesView.FULL,
        }
    )
    result_list = []
    for result in results:
        if result.metric.labels.get("state") == "free":
            _dict = {}
            _dict["vendor"] = "gcp"
            _dict["instance_id"] = result.resource.labels.get("instance_id")
            _dict["instance_name"] = ""
            _dict["metric"] = "memory"
            _dict["value"] = round(100 - result.points[0].value.double_value, 1)
            _dict["time"] = strftime('%Y-%m-%d %I:%M:%S %p', tm)
            _dict["time_key"] = strftime('%Y%m%d%I%M%S', tm)
            result_list.append(_dict)

    return result_list

def get_process_status(project_id, instance_id, process_name):

    client = monitoring_v3.MetricServiceClient()
    project_name = f"projects/{project_id}"

    now = time.time()
    tm = localtime(now)

    seconds = int(now)
    nanos = int((now - seconds) * 10 ** 9)
    interval = monitoring_v3.TimeInterval(
        {
            "end_time": {"seconds": seconds, "nanos": nanos},
            "start_time": {"seconds": (seconds - 120000), "nanos": nanos},
        }
    )

    results = client.list_time_series(
        request={
            "name": project_name,
            "filter": f"resource.type = \"gce_instance\" AND resource.labels.instance_id = \"{instance_id}\" metric.type = \"agent.googleapis.com/processes/cpu_time\" AND (metric.labels.command_line = \"{process_name}\" AND metric.labels.user_or_syst = \"user\")",
            "interval": interval,
            "view": monitoring_v3.ListTimeSeriesRequest.TimeSeriesView.FULL,
        }
    )

    _dict = {}
    is_running = 0
    for result in results:
        print(result)
        is_running = 1
        _dict["vendor"] = "gcp"
        _dict["instance_id"] = instance_id
        _dict["instance_name"] = project_id
        _dict["metric"] = "process"
        _dict["value"] = "running"
        _dict["time"] = strftime('%Y-%m-%d %I:%M:%S %p', tm)
    if is_running == 0:
        _dict["vendor"] = "gcp"
        _dict["instance_id"] = instance_id
        _dict["instance_name"] = project_id
        _dict["metric"] = f"process({process_name})"
        _dict["value"] = "stopped"
        _dict["time"] = strftime('%Y-%m-%d %I:%M:%S %p', tm)

    return _dict