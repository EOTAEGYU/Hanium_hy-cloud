#pip install --upgrade google-api-python-client
#pip install --upgrade google-cloud-monitoring

import os, time, sys
from time import strftime, localtime
from google.cloud import monitoring_v3
from common import ConfigManager, CommonUtil, RestClient

def print_list():
    client = monitoring_v3.MetricServiceClient()
    project_name = f"projects/poc-jhlee"

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
    project_name = f"projects/poc-jhlee"

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
            "filter": 'metric.type = "agent.googleapis.com/memory/percent_used" AND resource.labels.instance_id = "3361798994575063946"',
            #"filter": 'metric.type = "agent.googleapis.com/cpu/utilization"',
            "interval": interval,
            "view": monitoring_v3.ListTimeSeriesRequest.TimeSeriesView.FULL,
        }
    )
    for result in results:
        print(result)



def get_cpu_utilization(p_project_name, p_instance_id):

    client = monitoring_v3.MetricServiceClient()
    project_name = p_project_name

    now = time.time()
    tm = localtime(now)

    seconds = int(now)
    nanos = int((now - seconds) * 10 ** 9)
    interval = monitoring_v3.TimeInterval(
        {
            "end_time": {"seconds": seconds, "nanos": nanos},
            "start_time": {"seconds": (seconds - 60), "nanos": nanos},
        }
    )

    results = client.list_time_series(
        request={
            "name": project_name,
            #"filter": 'metric.type = "agent.googleapis.com/cpu/utilization" AND resource.labels.instance_id = "' + p_instance_id + '"',
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
            _dict["metric"] = "cpu"
            _dict["value"] = round(100 - result.points[0].value.double_value, 1)
            _dict["time"] = strftime('%Y-%m-%d %I:%M:%S %p', tm)
            _dict["time_key"] = strftime('%Y%m%d%I%M%S', tm)
            result_list.append(_dict)

    return result_list

def get_memory_utilization(p_project_name, p_instance_id):

    client = monitoring_v3.MetricServiceClient()
    project_name = p_project_name

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
            #"filter": 'metric.type = "agent.googleapis.com/memory/percent_used" AND resource.labels.instance_id = "' + p_instance_id + '"',
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
            _dict["metric"] = "memory"
            _dict["value"] = round(100 - result.points[0].value.double_value, 1)
            _dict["time"] = strftime('%Y-%m-%d %I:%M:%S %p', tm)
            _dict["time_key"] = strftime('%Y%m%d%I%M%S', tm)
            result_list.append(_dict)

    return result_list

if __name__ == '__main__':

    myfunc = sys._getframe().f_code.co_name
    os.environ.setdefault('GOOGLE_APPLICATION_CREDENTIALS', 'C:\\Temp\\poc-jhlee-cadc73bf2cce.json')
    rest_client = RestClient.RestClient()
    project_name = f"projects/poc-jhlee"

    results = get_cpu_utilization(project_name, "")
    for result in results:
        print(result)
        response = rest_client.restapi_post("http://127.0.0.1:8000/monitor_info", result)


    results = get_memory_utilization(project_name, "")
    for result in results:
        print(result)
        response = rest_client.restapi_post("http://127.0.0.1:8000/monitor_info", result)


    #print_get()
    #print_list()


# See PyCharm help at https://www.jetbrains.com/help/pycharm/
