import boto3
from datetime import datetime, timedelta
from time import strftime, localtime


def set_aws_credentials(access_key, secret_key, region_name):

    session = boto3.Session(
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        region_name=region_name
    )

    return session

def get_instance_list(session):

    ec2_client = session.client('ec2')

    _list = []
    response = ec2_client.describe_instances()
    for reservation in response['Reservations']:
        for instance in reservation['Instances']:

            _dict = {}
            _dict['instance_id'] = instance['InstanceId']
            _dict['instance_tag'] = instance['Tags'][0]['Value']
            _dict['status'] = instance['State']['Name']
            _list.append(_dict)
    return _list

def get_cpu_utilization(session, instances, region_name='ap-northeast-2'):

    cloudwatch_client = session.client('cloudwatch', region_name=region_name)

    end_time = datetime.utcnow()
    start_time = end_time - timedelta(minutes=10)

    result_list = []
    for instance in instances:
        # 메트릭 쿼리 설정
        response = cloudwatch_client.get_metric_data(
            MetricDataQueries=[
                {
                    'Id': 'cpuutil1',
                    'MetricStat': {
                        'Metric': {
                            'Namespace': 'AWS/EC2',
                            'MetricName': 'CPUUtilization',
                            'Dimensions': [
                                {
                                    'Name': 'InstanceId',
                                    'Value': instance['instance_id']
                                },
                            ]
                        },
                        'Period': 300,  # 300초 간격으로 데이터 조회
                        'Stat': 'Average',  # 평균값 사용
                        'Unit': 'Percent',  # 퍼센트로 반환
                    },
                    'ReturnData': True,
                },
            ],
            StartTime=start_time,
            EndTime=end_time,
        )

        # 조회된 데이터 출력
        for result in response['MetricDataResults']:
            for timestamp, value in zip(result['Timestamps'], result['Values']):

                _dict = {}
                _dict["vendor"] = "aws"
                _dict["instance_id"] = instance['instance_id']
                _dict["instance_name"] = instance['instance_tag']
                _dict["metric"] = "cpu"
                _dict["value"] = round(value,1)
                _dict["time"] = start_time.strftime('%Y-%m-%d %I:%M:%S %p')
                _dict["time_key"] = start_time.strftime('%Y%m%d%I%M%S')
                result_list.append(_dict)
                break # 리스트의 첫번째 row만 사용

    return result_list


def get_memory_utilization(session, instances, region_name='ap-northeast-2'):

    cloudwatch_client = session.client('cloudwatch')

    end_time = datetime.utcnow()
    start_time = end_time - timedelta(minutes=10)

    result_list = []
    for instance in instances:

        response = cloudwatch_client.get_metric_data(
            MetricDataQueries=[
                {
                    'Id': 'memory_usage',
                    'MetricStat': {
                        'Metric': {
                            'Namespace': 'CWAgent',
                            'MetricName': 'mem_used_percent',
                            'Dimensions': [
                                {
                                    'Name': 'InstanceId',
                                    'Value': instance['instance_id']
                                }
                            ]
                        },
                        'Period': 300,
                        'Stat': 'Average'
                    },
                    'ReturnData': True
                }
            ],
            StartTime=start_time,
            EndTime=end_time
        )

        if response['MetricDataResults'][0]['Values']:

            pmem = response['MetricDataResults'][0]['Values']
            timestamp = response['MetricDataResults'][0]['Timestamps']
            _dict = {}
            _dict["vendor"] = "aws"
            _dict["instance_id"] = instance['instance_id']
            _dict["instance_name"] = instance['instance_tag']
            _dict["metric"] = "memory"
            _dict["value"] = round(pmem[0], 1)
            _dict["time"] = timestamp[0].strftime('%Y-%m-%d %I:%M:%S %p')
            _dict["time_key"] = timestamp[0].strftime('%Y%m%d%I%M%S')
            result_list.append(_dict)

    return result_list


